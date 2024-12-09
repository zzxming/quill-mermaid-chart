const Quill = window.Quill;
const mermaid = window.mermaid;

Quill.register({
  'modules/mermaid': bundle.QuillMermaid,
}, true);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'code'],
      ['link', 'image', 'video', 'formula'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['mermaid-chart'],
    ],
    mermaid: {
      // editor: {
      //   dialogMaskClickClose: false,
      //   onClose() {
      //     console.log('close', this);
      //   },
      // },
      // histroyStackOptions: {
      //   maxStack: 10,
      // },
    },
  },
});

btn.addEventListener('click', () => {
  const content = quill.getContents();
  console.log(content);
  output.innerHTML = '';
  // eslint-disable-next-line unicorn/no-array-for-each
  content.forEach((content) => {
    const item = document.createElement('li');
    item.textContent = `${JSON.stringify(content)},`;
    output.appendChild(item);
  });
});

quill.setContents([
  {
    insert: '\n',
  },
  {
    insert: {
      'mermaid-chart': `graph TB
      A[Start] --> B{Is it?};
      B -->|Yes| C[OK];
      C --> D[Rethink];
      D --> B;
      B ---->|No| E[End];`,
    },
  },
  {
    insert: '\n',
  },
//   {
//     insert: {
//       'mermaid-chart': `flowchart TD
//   A[Christmas] -->|Get money| B(Go shopping)
//   B --> C{Let me think}
//   C -->|One| D[Laptop]
//   C -->|Two| E[iPhone]
//   C -->|Three| F[fa:fa-car Car]`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `%%{init: {"flowchart": {"htmlLabels": false}} }%%
// flowchart TB
//     markdown["\`This **is** _Markdown_\`"]
//     newLines["\`Line1
//     Line 2
//     Line 3\`"]
//     markdown --> newLines`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `sequenceDiagram
//     Alice->>John: Hello John, how are you?
//     John-->>Alice: Great!
//     Alice-)John: See you later!`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `pie title Pets adopted by volunteers
//     "Dogs" : 386
//     "Cats" : 85
//     "Rats" : 15`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `erDiagram
//       CUSTOMER ||--o{ ORDER : places
//       ORDER ||--|{ LINE-ITEM : contains
//       CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `sequenceDiagram
//     Alice->>Bob: Hello Bob, how are you ?
//     Bob->>Alice: Fine, thank you. And you?
//     create participant Carl
//     Alice->>Carl: Hi Carl!
//     create actor D as Donald
//     Carl->>D: Hi!
//     destroy Carl
//     Alice-xCarl: We are too many
//     destroy Bob
//     Bob->>Alice: I agree`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'showBranches': false}} }%%
//       gitGraph
//         commit
//         branch hotfix
//         checkout hotfix
//         commit
//         branch develop
//         checkout develop
//         commit id:"ash" tag:"abc"
//         branch featureB
//         checkout featureB
//         commit type:HIGHLIGHT
//         checkout main
//         checkout hotfix
//         commit type:NORMAL
//         checkout develop
//         commit type:REVERSE
//         checkout featureB
//         commit
//         checkout main
//         merge hotfix
//         checkout featureB
//         commit
//         checkout develop
//         branch featureA
//         commit
//         checkout develop
//         merge hotfix
//         checkout featureA
//         commit
//         checkout featureB
//         commit
//         checkout develop
//         merge featureA
//         branch release
//         checkout release
//         commit
//         checkout main
//         commit
//         checkout release
//         merge main
//         checkout develop
//         merge release`,
//     },
//   },
//   {
//     insert: '\n',
//   },
//   {
//     insert: {
//       'mermaid-chart': `mindmap
//   root((mindmap))
//     Origins
//       Long history
//       ::icon(fa fa-book)
//       Popularisation
//         British popular psychology author Tony Buzan
//     Research
//       On effectiveness<br/>and features
//       On Automatic creation
//         Uses
//             Creative techniques
//             Strategic planning
//             Argument mapping
//     Tools
//       Pen and paper
//       Mermaid`,
//     },
//   },
//   {
//     insert: '\n',
//   },
]);
