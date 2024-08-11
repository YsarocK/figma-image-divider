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
  const selection = figma.currentPage.selection[0];
  
  if(selection.type === 'COMPONENT') {
    const classData = new ImageDivider(
      {
        components: { main: selection as ComponentNode,
        nodes:  JSON.parse(selection.getPluginData('class')).nodes 
      }
    });
    classData.nodes = JSON.parse(classData.mainComponent.getPluginData('class')).nodes;
  }
}