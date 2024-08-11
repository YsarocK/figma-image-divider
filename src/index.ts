import { ImageDivider } from "./image-divider";

const command = figma.command;

figma.showUI(__html__, {
  height: 300,
  title: 'Instagram Multi Post Divider',
});

figma.ui.onmessage = async (msg: { type: string, count: number, size: number }) => {
  if (msg.type === 'image-divider') {
    new ImageDivider({ initParams: { count: msg.count, size: msg.size } });
  }
};

if(command === 'edit') {
  console.log('Relaunching');
  const lastSelection = figma.currentPage.selection[0];
  
  if(lastSelection.type === 'COMPONENT') {
    const classData = new ImageDivider(
      {
        components: { main: lastSelection as ComponentNode,
        nodes:  JSON.parse(lastSelection.getPluginData('class')).nodes 
      }
    });
    classData.nodes = JSON.parse(classData.mainComponent.getPluginData('class')).nodes;
  }
}