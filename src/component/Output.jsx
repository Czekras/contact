import ReactModal from 'react-modal';
import { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import prettier from 'prettier/standalone';
// import parserBabel from 'prettier/parser-babel';
// import parserHTML from 'prettier/parser-html';

const customStyles = {
  content: {
    // top: '50%',
    // left: '50%',
    // right: 'auto',
    // bottom: 'auto',
    // marginRight: '-50%',
    // transform: 'translate(-50%, -50%)',
  },
  overlay: {
    zIndex: 90,
  },
};

ReactModal.setAppElement('#root');
SyntaxHighlighter.registerLanguage('xml', xml);

export default function Output({ data }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const codeAvailable = data.userFormList.length > 0;

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const generatedMainCode = data.userFormList.map((item) => {
    const mainList = [];

    const requiredList =
      item.required === 'option1'
        ? [
            `<span class="required-mark">必要</span>`,
            `<?php if (isset($error['${item.inputName}'])) echo '<p class="error-text">' . $error['${item.inputName}'] . '</p>'; ?>`,
          ]
        : item.required === 'option2'
        ? [`<span class="required-mark">任意</span>`, null]
        : [null, null];

    const inputMaxLength = item.inputMaxLength
      ? `maxLength="${item.inputMaxLength}"`
      : '';

    if (item.type === 1) {
      mainList.push(
        `<tr><th><label for="${item.labelFor}">${item.nameJA}</label>${
          requiredList[0] || ''
        }</th><td>${requiredList[1] || ''}<input type="${
          item.inputType
        }" name="items[${item.inputName}]" id="${item.inputId}" size="${
          item.inputSize
        }" value="<?php if (isset($items['${
          item.inputName
        }'])) echo h($items['${item.inputName}']); ?>" placeholder="${
          item.inputPlaceholder
        } ${inputMaxLength}"></td></tr>`
      );
    }

    if (item.type === 2) {
      mainList.push(
        `<tr><th><label for="${item.labelFor}">${item.nameJA}</label>${
          requiredList[0] || ''
        }</th><td>${requiredList[1] || ''}<textarea name="items[${
          item.inputName
        }]" id="${item.inputId}" cols="${item.inputCols}" rows="${
          item.inputRows
        }" placeholder="${item.inputPlaceholder}"><?php if (isset($items['${
          item.inputName
        }'])) echo $items['${item.inputName}']; ?></textarea></td></tr>`
      );
    }

    if (item.type === 3) {
      mainList.push(
        `<tr><th><label for="${item.inputPostalName1}">${item.nameJA}</label>${
          requiredList[0] || ''
        }</th><td class="h-adr">${
          requiredList[1] || ''
        }<span class="p-country-name" style="display:none;">Japan</span><div>〒 <input type="${
          item.inputPostalType1
        }" class="p-postal-code" name="items[${item.inputPostalName1}]" id="${
          item.inputPostalName1
        }" size="${item.inputPostalSize1}" value="<?php if (isset($items['${
          item.inputPostalName1
        }'])) echo h($items['${item.inputPostalName1}']); ?>" placeholder="${
          item.inputPostalPlaceholder1
        }" maxlength="${item.inputPostalMaxLength1}"> -<input type="${
          item.inputPostalType2
        }" class="p-postal-code" name="items[${item.inputPostalName2}]" id="${
          item.inputPostalName2
        }" size="${item.inputPostalSize2}" value="<?php if (isset($items['${
          item.inputPostalName2
        }'])) echo h($items['${item.inputPostalName2}']); ?>" placeholder="${
          item.inputPostalPlaceholder2
        }" maxlength="${item.inputPostalMaxLength2}"></div><div><input type="${
          item.inputType
        }" class="p-region p-locality p-street-address p-extended-address" name="items[${
          item.inputName
        }]" id="${item.inputId}" size="${
          item.inputSize
        }" value="<?php if (isset($items['${
          item.inputName
        }'])) echo h($items['${item.inputName}']); ?>"></div></td></tr>`
      );
    }

    if (item.type === 4) {
      mainList.push(
        ` <th><label>${item.nameJA}への同意</label>${
          requiredList[0] || ''
        }</th><td>${requiredList[1] || ''}<input type="hidden" name="items[${
          item.inputId
        }]" value=""><input type="${item.inputType}" name="items[${
          item.inputId
        }]" id="${item.inputId}" value="同意する" <?php if (isset($items['${
          item.inputId
        }']) && $items['${
          item.inputId
        }'] !== '') echo 'checked'; ?>><label for="${
          item.inputId
        }"><a class="privacy-link" href="/privacy/" target="_blank"><span>${
          item.nameJA
        }</span></a>に同意する</label> </td>`
      );
    }

    if (item.type === 5) {
      if (item.inputType === 'checkbox') {
        mainList.push(
          `<th><label>${item.nameJA}</label>${requiredList[0] || ''}</th><td>
              ${requiredList[1] || ''}
              ${Object.entries(item.itemList).map((innerItemList, index) => {
                const innerItem = innerItemList[1];
                const newIndex = index + 1;
                return `
                <input type="hidden" name="items[${item.inputId}][${newIndex}]" value="">
                <input type="${item.inputType}" name="items[${item.inputId}][${newIndex}]" id="${innerItem.id}" value="${innerItem.label}" <?php if (isset($items['${item.inputId}'][${newIndex}]) && $items['${item.inputId}'][${newIndex}] !== '') echo 'checked'; ?>>
                <label for="${innerItem.id}">${innerItem.label}</label>
                `;
              })}
          </td>`
        );
      }

      if (item.inputType === 'radio') {
        mainList.push(
          `<th><label>${item.nameJA}</label>${requiredList[0] || ''}</th><td>
            ${requiredList[1] || ''}
            ${Object.entries(item.itemList).map((innerItemList) => {
              const innerItem = innerItemList[1];
              return `<input type="${item.inputType}" name="items[${item.inputId}]" id="${innerItem.id}" <?php if (isset($items['${item.inputId}']) && $items['${item.inputId}'] === '${innerItem.label}') echo 'checked'; ?> value="${innerItem.label}"><label for="${innerItem.id}">${innerItem.label}</label>`;
            })}
          </td>`
        );
      }
    }

    if (item.type === 6) {
      mainList.push(
        `<th><label for="${item.labelFor}">${item.nameJA}</label>${
          requiredList[0] || ''
        }</th><td>${requiredList[1] || ''}<select name="items[${
          item.inputName
        }]" id="${
          item.inputId
        }"><option value="未選択" <?php if (isset($items['${
          item.inputId
        }']) && $items['${
          item.inputId
        }'] === '未選択') echo "selected"; ?>>未選択</option>${Object.entries(
          item.itemList
        ).map((innerItemList, index) => {
          const innerItem = innerItemList[1];
          return `<option value="${innerItem.label}" <?php if (isset($items['${item.inputId}']) && $items['${item.inputId}'] === '${innerItem.label}') echo "selected"; ?>>${innerItem.label}</option>`;
        })}</select></td>`
      );
    }

    return mainList;
  });

  return (
    <div className="output">
      <button
        className="output__button output__button--word"
        onClick={openModal}
        disabled={!codeAvailable}
      >
        <span className="material-symbols-outlined">
          {codeAvailable ? 'code' : 'code_off'}
        </span>
        <p>Code</p>
      </button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="output__modal"
        contentLabel="Output Modal"
      >
        <div className="output__top">
          <header className="output__header">
            <h3 className="output__title">code modal</h3>
          </header>
          <button
            onClick={closeModal}
            className="output__button output__button--close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="output__content">
          <div className="output__item">
            <div className="output__item-top">
              <header className="output__item-header">
                <h3 className="output__item-title">Main Table</h3>
                <p className="output__item-description">
                  下記のコードはお問い合わせのメインテーブルとなります。
                </p>
              </header>
              <button className="output__button">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
            <div className="output__item-code">
              &lt;table class="contact-form-table"&gt;
              {generatedMainCode.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
              {/* {generatedMainCode.map(item => {
                  return item.toString() + <br />
                })} */}
              {/* {generatedMainCode.join('\n')} */}
              &lt;/table&gt;
            </div>
            {/* <SyntaxHighlighter language="html" style={docco}> */}
            {/* &lt;table class="contact-form-table"&gt; */}
            {/* {generatedMainCode.flat()} */}
            {/* &lt;/table&gt; */}
            {/* </SyntaxHighlighter> */}
          </div>
          <p className="output__note">
            ※コードはの縮小版になっているため、エディタに貼り付けて再フォーマットしてください。
          </p>
        </div>
      </ReactModal>
    </div>
  );
}
