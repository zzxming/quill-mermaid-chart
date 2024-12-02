import type { EditorInputElement } from '@/modules/history-input';
import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block';
import { HistroyInput } from '@/modules/history-input';
import { chartTemplate, debounce, mermaidDataKey, randomId, renderMermaidInNode, SHORTKEY } from '@/utils';
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed;

type MermaidChartNode = HTMLElement & { [mermaidDataKey]: string };
type MermaidChartMode = 'edit' | 'chart';
export class MermaidChartFormat extends BlockEmbed {
  static tagName = 'mc-chard';
  static blotName = 'mermaid-chart';
  static className = 'ql-mermaid-chart';

  static create(value: string) {
    if (!value) value = chartTemplate[(Object.keys(chartTemplate) as (keyof typeof chartTemplate)[])[0]];
    const node = super.create() as MermaidChartNode;
    node.setAttribute('contenteditable', 'false');
    node[mermaidDataKey] = value;
    const id = randomId();
    node.dataset.id = id;
    const chart = document.createElement('div');
    chart.classList.add('chart');
    node.appendChild(chart);
    renderMermaidInNode(chart, id, value, chart);
    return node;
  }

  static value(domNode: MermaidChartNode) {
    return domNode[mermaidDataKey] || '';
  }

  mode: MermaidChartMode = 'chart';
  declare domNode: MermaidChartNode;

  get id() {
    return this.domNode.dataset.id!;
  }

  get text() {
    return this.domNode[mermaidDataKey];
  }

  getChart() {
    return this.domNode.querySelector(`.chart`) as HTMLElement;
  }

  // TODO: 处理输入框的ctrl+x 等按键默认行为
  private bindInputEvent(textInput: HistroyInput) {
    const renderPreview = debounce(() => {
      this.updatePreview(textInput.el.value);
    }, 500);
    textInput.el.addEventListener('keydown', async (e) => {
      e.stopImmediatePropagation();
      let isNeedUpdate = false;
      if (e.code === 'Tab') {
        e.preventDefault();
        const { selectionStart, selectionEnd } = textInput.el;
        const input = e.target! as EditorInputElement;
        input.value = `${input.value.slice(0, selectionStart)}  ${input.value.slice(selectionEnd)}`;
        input.setSelectionRange(selectionStart + 2, selectionStart + 2);
        console.log(selectionStart);
        isNeedUpdate = true;
      }
      if (e[SHORTKEY] && e.code === 'KeyZ') {
        if (e.shiftKey) {
          textInput.redo();
        }
        else {
          textInput.undo();
        }
        e.preventDefault();
        isNeedUpdate = true;
      }
      console.log(isNeedUpdate);
      if (isNeedUpdate) {
        renderPreview();
      }
    });
    textInput.el.addEventListener('input', () => {
      renderPreview();
    });
  }

  createEditor() {
    const editor = document.createElement('div');
    editor.classList.add('editor');
    const textInput = new HistroyInput(document.createElement('textarea'));
    textInput.el.classList.add('editor-input');
    textInput.el.value = this.domNode[mermaidDataKey];
    this.bindInputEvent(textInput);
    editor.appendChild(textInput.el);

    const header = document.createElement('div');
    header.classList.add('qmc-mermaid__editor-header');
    const template = document.createElement('select');
    template.classList.add('qmc-mermaid__editor-template');
    const option = document.createElement('option');
    option.textContent = 'Template';
    option.setAttribute('hidden', 'true');
    option.setAttribute('selected', 'true');
    template.appendChild(option);
    template.setAttribute('placeholder', 'Template');
    for (const [key, value] of Object.entries(chartTemplate)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = key;
      template.appendChild(option);
    }
    template.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const value = target.value;
      if (value) {
        textInput.record(textInput.el.value, [textInput.el.selectionStart, textInput.el.selectionEnd]);
        textInput.el.value = value;
        this.updatePreview(value);
      }
      target.selectedIndex = 0;
    });
    header.appendChild(template);

    this.domNode.insertBefore(editor, this.domNode.firstChild);
  }

  updatePreview(value: string) {
    this.domNode[mermaidDataKey] = value;
    const chart = this.getChart();
    return renderMermaidInNode(chart, this.id, value, chart);
  }

  removeEditor() {

  }

  changeMode(mode: MermaidChartMode) {
    if (mode === 'edit') {
      if (this.mode === 'chart') {
        this.createEditor();
      }
    }
    else if (mode === 'chart' && this.mode === 'edit') {
      this.removeEditor();
    }
  }
}
