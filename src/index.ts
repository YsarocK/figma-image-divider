import { ImageDivider } from "./image-divider";

const command = figma.command;

figma.showUI(__html__, {
  height: 400,
  title: 'Instagram Multi Post Divider',
  position: {
    x: 0,
    y: 0
  }
});

figma.ui.onmessage = async (msg: { type: string, count: number, size: number }) => {
  if (msg.type === 'image-divider') {
    new ImageDivider({ withParams: { count: msg.count, size: msg.size } });
  }
};

if(command === 'edit') {
  const selection = figma.currentPage.selection[0];
  
  if(selection.type === 'COMPONENT') {
    new ImageDivider(
      {
        withNodes: {
          main: selection as ComponentNode,
          generated:  JSON.parse(selection.getPluginData('class')).generatedNodes 
      }
    });
  }
}