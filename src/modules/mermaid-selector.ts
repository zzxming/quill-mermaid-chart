import type { MermaidChartFormat } from '@/formats';
import type Quill from 'quill';
import type { HistroyInputOptions } from './history-input';
import type { MermaidEditor, MerMaidEditorOptions } from './mermaid-editor';
import { addScrollEvent, clearScrollEvent, events } from '@/utils';
import closeSvg from '../svg/close.svg';
import editSvg from '../svg/edit.svg';

export interface MermaidSelectorOptions {
  onDestroy: () => void;
  editorOptions: Partial<MerMaidEditorOptions>;
}
export class MermaidSelector {
  #internalDestroy: boolean = false;
  options: MermaidSelectorOptions;
  scrollHandler: [HTMLElement, (e: Event) => void][] = [];
  toolbox?: HTMLElement;
  selector?: HTMLDivElement;
  resizeOb?: ResizeObserver;
  editor?: MermaidEditor;
  histroyStackOptions?: Partial<HistroyInputOptions>;
  constructor(public quill: Quill, public mermaidBlot: MermaidChartFormat, options?: Partial<MermaidSelectorOptions>, histroyStackOptions?: Partial<HistroyInputOptions>) {
    this.options = this.resolveOptions(options);
    this.histroyStackOptions = histroyStackOptions;

    this.toolbox = this.quill.addContainer('ql-toolbox');
    this.createSelector();
  }

  resolveOptions(options?: Partial<MermaidSelectorOptions>) {
    return Object.assign({
      onDestroy: () => {},
      editorOptions: {},
    }, options);
  }

  addContainer(classes: string) {
    if (!this.toolbox) return;
    const el = document.createElement('div');
    for (const classname of classes.split(' ')) {
      el.classList.add(classname);
    }
    this.toolbox.appendChild(el);
    return el;
  }

  updateSelector() {
    if (!this.selector) return;
    const mermaidNode = this.mermaidBlot.domNode;
    const mermaidRect = mermaidNode.getBoundingClientRect();
    const { x, y } = getRelativeRect(mermaidRect, this.quill.root);
    const { scrollTop, scrollLeft } = this.quill.root;
    Object.assign(this.selector.style, {
      left: `${x + scrollLeft}px`,
      top: `${y + scrollTop}px`,
      width: `${mermaidRect.width}px`,
      height: `${mermaidRect.height}px`,
    });
    clearScrollEvent.call(this);
    addScrollEvent.call(this, this.quill.root, () => {
      Object.assign(this.selector!.style, {
        left: `${x + scrollLeft * 2 - this.quill.root.scrollLeft}px`,
        top: `${y + scrollTop * 2 - this.quill.root.scrollTop}px`,
      });
    });
  }

  createSelector() {
    this.selector = this.addContainer('ql-mermaid-select');
    if (!this.selector) return;
    this.updateSelector();
    this.resizeOb = new ResizeObserver(() => {
      this.updateSelector();
    });
    this.resizeOb.observe(this.mermaidBlot.domNode);

    const editBtn = createBtnIcon({
      iconStr: editSvg,
      classList: ['ql-mermaid-select-edit'],
      click: () => {
        // this.editor = new MermaidEditor(this.quill, this.mermaidBlot, {
        //   ...this.options.editorOptions,
        //   onClose: () => {
        //     this.editor = undefined;
        //     if (this.options.editorOptions.onClose) {
        //       this.options.editorOptions.onClose();
        //     }
        //   },
        // }, this.histroyStackOptions);
        this.mermaidBlot.changeMode('edit');
      },
    });
    const removeBtn = createBtnIcon({
      iconStr: closeSvg,
      classList: ['ql-mermaid-select-close'],
      click: () => {
        this.mermaidBlot.remove();
        this.#internalDestroy = true;
        this.destroy();
      },
    });
    this.quill.on(events.mermaidModeChange, (mode: 'chart' | 'edit') => {
      if (this.selector) {
        this.selector.classList.add(mode);
      }
    });

    this.selector.appendChild(removeBtn);
    this.selector.appendChild(editBtn);
  }

  destroy() {
    this.quill.off(events.mermaidModeChange);
    clearScrollEvent.call(this);
    if (this.resizeOb) {
      this.resizeOb.disconnect();
    }
    if (this.toolbox) {
      this.toolbox.remove();
      this.toolbox = undefined;
    }
    if (this.#internalDestroy) {
      this.#internalDestroy = false;
      this.options.onDestroy();
    }
  }
}

export function getRelativeRect(targetRect: DOMRect, container: HTMLElement) {
  const containerRect = container.getBoundingClientRect();

  return {
    x: targetRect.x - containerRect.x - container.scrollLeft,
    y: targetRect.y - containerRect.y - container.scrollTop,
    x1: targetRect.x - containerRect.x - container.scrollLeft + targetRect.width,
    y1: targetRect.y - containerRect.y - container.scrollTop + targetRect.height,
    width: targetRect.width,
    height: targetRect.height,
  };
}

function createBtnIcon(options: {
  iconStr: string;
  classList: string[];
  click: (e: MouseEvent) => void;
}) {
  const { iconStr, classList, click } = options;
  const btn = document.createElement('span');
  btn.classList.add('ql-mermaid-select-btn', ...classList);
  const icon = document.createElement('i');
  icon.classList.add('ql-mermaid-icon');
  icon.innerHTML = iconStr;
  btn.appendChild(icon);
  btn.addEventListener('click', click);
  return btn;
}
