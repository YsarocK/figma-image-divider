figma.showUI(__html__);

interface GridMakerProps {
  count: number;
  size: number;
};

interface GridMaker {
  count: number;
  size: number;
  nodes: FrameNode[];
  mainFrame: FrameNode;
  mainComponent: ComponentNode;
}

class GridMaker {
  constructor({ count, size }: GridMakerProps) {
    this.count = count;
    this.size = size;
    this.nodes = [];

    this.init();
  }

  private init() {
    this.createMainComponent();
    this.generateNodes();
  }

  createMainComponent() {
    this.mainFrame = figma.createFrame();
    this.mainFrame.resize(this.count * this.size, this.size);
    this.mainFrame.clipsContent = true;
    this.mainComponent = figma.createComponentFromNode(this.mainFrame);
    figma.currentPage.appendChild(this.mainComponent);

    figma.currentPage.selection = this.nodes;
    figma.viewport.scrollAndZoomIntoView(this.nodes);
  }

  generateNodes({ count, size }: GridMakerProps = { count: this.count, size: this.size }) {
    for (let i = 0; i < count; i++) {
      const rect = figma.createFrame();
      rect.resize(size, size);
      rect.x = i * (size + 150);
      rect.y = 1.25 * size;
      const compInstance = this.mainComponent.createInstance();
      compInstance.x = (-1 * size) * i;
      rect.insertChild(0, compInstance);
      figma.currentPage.appendChild(rect);
      this.nodes.push(rect);
    }
  };

  deleteNodes() {
    this.nodes.forEach((node) => {
      node.remove();
    });
    this.nodes = [];
  }

  exportAll() {
    figma.currentPage.selection = this.nodes;
  }
}

figma.ui.onmessage = async (msg: { type: string, count: number, size: number }) => {
  if (msg.type === 'image-divider') {
    const grid = new GridMaker({ count: msg.count, size: msg.size });
    
    await figma.loadAllPagesAsync();
    figma.on('documentchange', ({ documentChanges }) => {
      const { id } = documentChanges[0];

      if (id === grid.mainComponent.id) {
        const count = Math.floor(grid.mainComponent.width / grid.mainComponent.height)
        grid.deleteNodes();
        grid.generateNodes({ count, size: grid.mainComponent.height });
      }
    });
  }
};
