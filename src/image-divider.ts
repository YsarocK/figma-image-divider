interface ImageDividerProps {
  withParams?: {
    count: number;
    size: number;
  };
  withNodes?: {
    main: ComponentNode;
    generated: string[];
  };
};

interface ImageDivider {
  count: number;
  size: number;
  deadZone: number;
  generatedNodes: string[];
  mainFrame: FrameNode;
  mainComponent: ComponentNode;
}

class ImageDivider {
  constructor({ withParams, withNodes }: ImageDividerProps) {
    if(withNodes) {
      this.mainComponent = withNodes.main;
      this.generatedNodes = withNodes.generated;
      this.count = Math.floor(this.mainComponent.width / this.mainComponent.height)
      this.size = this.mainComponent.height;
    }

    if(withParams) {
      this.count = withParams.count;
      this.size = withParams.size;
      this.generatedNodes = [];
  
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

  public generate({ count, size } = { count: this.count, size: this.size }) {
    if (this.count === count || this.size === size || this.generatedNodes.length > 0) {
      if(this.generatedNodes.length > 0) {
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
        this.generatedNodes.push(rect.id)
      }
    }

    this.generateDeadZone();
    
    this.mainComponent.setPluginData('class', JSON.stringify({
      mainComponent: this.mainComponent,
      generatedNodes: this.generatedNodes,
    }));
  };

  private generateDeadZone() {
    this.deadZone = this.mainComponent.width - (this.count * this.size);
    this.mainComponent.layoutGrids = [
      {
        visible: true,
        color: { r: 1, g: 0, b: 0, a: 0.1 },
        pattern: "COLUMNS",
        alignment: "MAX",
        sectionSize: this.deadZone,
        count: 1,
        gutterSize: 20,
        offset: 0,
      }
    ]
  }

  private deleteNodes() {
    this.generatedNodes.forEach(async (nodeId) => {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (node) {
          node.remove();
      }
    });
    this.generatedNodes = [];
  }
}

export { ImageDivider };