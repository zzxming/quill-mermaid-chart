import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import { chartTemplate, dataKey, randomId, renderMermaidInNode } from '@/utils';
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed;

type MermaidChartNode = HTMLElement & { [dataKey]: string };

export class MermaidChartFormat extends BlockEmbed {
  static tagName = 'div';
  static blotName = 'mermaid-chart';
  static className = 'ql-mermaid-chart';

  static create(value: string) {
    if (!value) value = chartTemplate.flowchart;
    const node = super.create() as MermaidChartNode;
    node.setAttribute('contenteditable', 'false');
    node[dataKey] = value;
    const id = randomId();
    node.dataset.id = id;
    const chart = document.createElement('div');
    chart.classList.add('chart');
    node.appendChild(chart);
    renderMermaidInNode(node, id, value, chart);
    return node;
  }

  static value(domNode: MermaidChartNode) {
    return domNode[dataKey] || '';
  }

  declare domNode: MermaidChartNode;

  get id() {
    return this.domNode.dataset.id!;
  }

  get text() {
    return this.domNode[dataKey];
  }

  set text(value: string) {
    this.domNode[dataKey] = value;
    renderMermaidInNode(this.domNode, this.id, value, this.getChart());
  }

  getChart() {
    return this.domNode.querySelector(`.chart`) as HTMLElement;
  }
}
