interface ImageDividerProps {
  count: number;
  size: number;
};

interface ImageDivider {
  count: number;
  size: number;
  dead_zone: number;
  nodes: string[];
  mainFrame: FrameNode;
  mainComponent: ComponentNode;
}

class ImageDivider {
  constructor({ initParams, components }: { initParams?: ImageDividerProps, components?: { main: ComponentNode, nodes: string[] } }) {
    if(components) {
      this.mainComponent = components.main;
      this.nodes = components.nodes;
      this.count = Math.floor(this.mainComponent.width / this.mainComponent.height)
      this.size = this.mainComponent.height;
    }

    if(initParams) {
      this.count = initParams.count;
      this.size = initParams.size;
      this.nodes = [];
  
      this.createMainComponent();
    }
    
    this.init();
  }

  public async init() {
    this.generate();
    this.listener();
  }

  public async listener() {
    await figma.loadAllPagesAsync();
    figma.on('documentchange', ({ documentChanges }: { documentChanges: any }) => {
      console.log(this.nodes)
      const { id } = documentChanges[0];

      if (id === this.mainComponent.id) {
        const count = Math.floor(this.mainComponent.width / this.mainComponent.height)
        this.generate({ count, size: this.mainComponent.height });
      }
    });
  }

  private createMainComponent() {
    this.mainFrame = figma.createFrame();
    this.mainFrame.resize(this.count * this.size, this.size);
    this.mainFrame.clipsContent = true;
    this.mainComponent = figma.createComponentFromNode(this.mainFrame);
    figma.currentPage.appendChild(this.mainComponent);

    this.mainComponent.setRelaunchData({ edit: 'Activate dynamic resize & frames.' });
  }

  generate({ count, size }: ImageDividerProps = { count: this.count, size: this.size }) {
    if(this.nodes.length > 0) {
      this.deleteNodes();
    }

    this.count = count;
    this.size = size;
    
    for (let i = 0; i < count; i++) {
      const rect = figma.createFrame();
      rect.resize(size, size);
      rect.x = i * (size + 150);
      rect.y = 1.25 * size;
      const compInstance = this.mainComponent.createInstance();
      compInstance.x = (-1 * size) * i;
      rect.insertChild(0, compInstance);
      figma.currentPage.appendChild(rect);
      this.nodes.push(rect.id)
    }

    this.generateDeadZone();
    
    this.mainComponent.setPluginData('class', JSON.stringify({
      mainComponent: this.mainComponent,
      nodes: this.nodes,
    }));
  };

  private generateDeadZone() {
    console.log('generateDeadZone')
    this.dead_zone = this.mainComponent.width - (this.count * this.size);
    this.mainComponent.layoutGrids = [
      {
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
        pattern: "COLUMNS",
        alignment: "MAX",
        sectionSize: this.dead_zone,
        count: 1,
        gutterSize: 20,
        offset: 0,
      }
    ]
  }

  private deleteNodes() {
    this.nodes.forEach(async (nodeId) => {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (node) {
          node.remove();
      }
    });
    this.nodes = [];
  }
}

export { ImageDivider };