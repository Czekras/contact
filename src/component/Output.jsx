import ReactModal from 'react-modal';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { githubGist as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const customStyles = {
  overlay: {
    zIndex: 110,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

ReactModal.setAppElement('#root');

export default function Output({ data }) {
  const [copyMain, setCopyMain] = useState(false);
  const [copyConfirm, setCopyConfirm] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const codeAvailable = data.userFormList.length > 0;

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  /* ------------------------------ User Settings ----------------------------- */
  const userData = data.userSettingList;

  let userTable = '';
  let userTbody = '';
  let userTr = '';
  let userTh = '';
  let userTd = '';
  let userRequire = '';
  let userOption = '';
  let userMemo = '';

  if (userData.length > 0) {
    userTable = userData[0].value ? ` class="${userData[0].value}"` : '';
    userTbody = userData[1].value ? ` class="${userData[1].value}"` : '';
    userTr = userData[2].value ? ` class="${userData[2].value}"` : '';
    userTh = userData[3].value ? ` class="${userData[3].value}"` : '';
    userTd = userData[4].value ? ` class="${userData[4].value}"` : '';
    userRequire = userData[5].value ? ` class="${userData[5].value}"` : '';
    userOption = userData[6].value ? ` class="${userData[6].value}"` : '';
    userMemo = userData[7].value ? ` class="${userData[7].value}"` : '';
  }

  /* -------------------------------------------------------------------------- */

  const mainOuputList = (item) => {
    const tableString = [`<table${userTable}>`, '</table>'];
    const tbodystring = [`  <tbody${userTbody}>`, '  </tbody>'];
    const tbodyOption = data.userOptions.tbodyOption;

    let outputList = [tableString[0], item.join('\n'), tableString[1]];

    if (tbodyOption) {
      outputList = [
        tableString[0],
        tbodystring[0],
        item.join('\n'),
        tbodystring[1],
        tableString[1],
      ];
    }

    return outputList;
  };

  const copytToClipboard = (tableName, copy) => {
    // const copySet = [`<table${userTable}>`, copy.join('\n'), '</table>'];
    const copySet = mainOuputList(copy);
    navigator.clipboard.writeText(copySet.join('\n'));

    if (tableName === 'main') {
      setCopyMain(true);
      setTimeout(() => {
        setCopyMain(false);
      }, 1500);
    }

    if (tableName === 'confirm') {
      setCopyConfirm(true);
      setTimeout(() => {
        setCopyConfirm(false);
      }, 1500);
    }
  };

  const generatedMainCode = data.userFormList.map((item) => {
    const mainList = [];

    const memo = (value, multiplier) => {
      if (value) {
        const space = ' '.repeat(multiplier);
        return `\n${space}<p${userMemo}>※${value}</p>`;
      }

      return '';
    };

    const requiredList =
      item.required === 'option1'
        ? [
            `<span${userRequire}>必須</span>`,
            `<?php if (isset($error['${item.inputName}'])) echo '<p class="error-text">' . $error['${item.inputName}'] . '</p>'; ?>`,
          ]
        : item.required === 'option2'
        ? [
            `<span${userOption}>任意</span>`,
            `<?php // if (isset($error['${item.inputName}'])) echo '<p class="error-text">' . $error['${item.inputName}'] . '</p>'; ?>`,
          ]
        : [
            `<?php // <span${userRequire}>必須</span> ?>`,
            `<?php // if (isset($error['${item.inputName}'])) echo '<p class="error-text">' . $error['${item.inputName}'] . '</p>'; ?>`,
          ];

    const inputMaxLength = item.inputMaxLength
      ? ` maxlength="${item.inputMaxLength}"`
      : '';

    if (item.type === 1) {
      mainList.push(
        `  <tr${userTr}>
    <th${userTh}>
      <label for="${item.labelFor}">${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
      <input type="${item.inputType}" name="items[${item.inputName}]" id="${
          item.inputId
        }" size="${item.inputSize}" value="<?php if (isset($items['${
          item.inputName
        }'])) echo h($items['${item.inputName}']); ?>" placeholder="${
          item.inputPlaceholder
        }"${inputMaxLength}>${memo(item.inputNote, 6)}
    </td>
  </tr>`
      );
    }

    if (item.type === 2) {
      mainList.push(
        `  <tr${userTr}>
    <th${userTh}>
      <label for="${item.labelFor}">${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
      <textarea name="items[${item.inputName}]" id="${item.inputId}" cols="${
          item.inputCols
        }" rows="${item.inputRows}" placeholder="${
          item.inputPlaceholder
        }"><?php if (isset($items['${item.inputName}'])) echo $items['${
          item.inputName
        }']; ?></textarea>${memo(item.inputNote, 5)}
    </td>
  </tr>`
      );
    }

    if (item.type === 3) {
      mainList.push(
        `  <tr${userTr}>
    <th${userTh}>
      <label for="${item.inputPostalName1}">${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td class="h-adr">
      ${requiredList[1] || ''}
      <span class="p-country-name" style="display:none;">Japan</span>
      <div>
        〒 <input type="${
          item.inputPostalType1
        }" class="p-postal-code" name="items[${item.inputPostalName1}]" id="${
          item.inputPostalName1
        }" size="${item.inputPostalSize1}" value="<?php if (isset($items['${
          item.inputPostalName1
        }'])) echo h($items['${item.inputPostalName1}']); ?>" placeholder="${
          item.inputPostalPlaceholder1
        }" maxlength="${item.inputPostalMaxLength1}"> -
        <input type="${
          item.inputPostalType2
        }" class="p-postal-code" name="items[${item.inputPostalName2}]" id="${
          item.inputPostalName2
        }" size="${item.inputPostalSize2}" value="<?php if (isset($items['${
          item.inputPostalName2
        }'])) echo h($items['${item.inputPostalName2}']); ?>" placeholder="${
          item.inputPostalPlaceholder2
        }" maxlength="${item.inputPostalMaxLength2}">
      </div>
      <div>
        <input type="${
          item.inputType
        }" class="p-region p-locality p-street-address p-extended-address" name="items[${
          item.inputName
        }]" id="${item.inputId}" size="${
          item.inputSize
        }" value="<?php if (isset($items['${
          item.inputName
        }'])) echo h($items['${item.inputName}']); ?>">
      </div>${memo(item.inputNote, 6)}
    </td>
  </tr>`
      );
    }

    if (item.type === 4) {
      mainList.push(
        `  <tr${userTr}>
    <th${userTh}>
      <label>${item.nameJA}への同意</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
      <input type="hidden" name="items[${item.inputName}]" value="">
      <input type="${item.inputType}" name="items[${item.inputName}]" id="${
          item.inputId
        }" value="同意する" <?php if (isset($items['${
          item.inputName
        }']) && $items['${item.inputName}'] !== '') echo 'checked'; ?>>
      <label for="${
        item.inputName
      }"><a class="privacy-link" href="/privacy/" target="_blank"><span>${
          item.nameJA
        }</span></a>に同意する</label>
    </td>
  </tr>`
      );
    }

    if (item.type === 5) {
      if (item.inputType === 'checkbox') {
        const innerItemList = item.itemList
          ? Object.entries(item.itemList).map((innerItemList, index) => {
              let lastItem = false;
              const innerItemLength = Object.keys(item.itemList).length - 1;
              if (index === innerItemLength) lastItem = true;

              const innerItem = innerItemList[1];
              const newIndex = index + 1;

              return `      <input type="hidden" name="items[${
                item.inputId
              }][${newIndex}]" value="">
      <input type="${item.inputType}" name="items[${
                item.inputId
              }][${newIndex}]" id="${innerItem.id}" value="${
                innerItem.label
              }" <?php if (isset($items['${
                item.inputId
              }'][${newIndex}]) && $items['${
                item.inputId
              }'][${newIndex}] !== '') echo 'checked'; ?>>
      <label for="${innerItem.id}">${innerItem.label}</label>${
                lastItem ? '' : '\n'
              }`;
            })
          : [];

        mainList.push(
          `  <tr${userTr}> 
    <th${userTh}>
      <label>${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
${innerItemList.join('\n')}${memo(item.inputNote, 6)}
    </td>
  </tr>`
        );
      }

      if (item.inputType === 'radio') {
        const innerItemList = item.itemList
          ? Object.entries(item.itemList).map((innerItemList) => {
              const innerItem = innerItemList[1];
              return `      <input type="${item.inputType}" name="items[${item.inputId}]" id="${innerItem.id}" <?php if (isset($items['${item.inputId}']) && $items['${item.inputId}'] === '${innerItem.label}') echo 'checked'; ?> value="${innerItem.label}"><label for="${innerItem.id}">${innerItem.label}</label>`;
            })
          : [];

        mainList.push(
          `  <tr${userTr}>
    <th${userTh}>
      <label>${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
${innerItemList.join('\n')}${memo(item.inputNote, 6)}
    </td>
  </tr>`
        );
      }
    }

    if (item.type === 6) {
      const innerItemList = item.itemList
        ? Object.entries(item.itemList).map((innerItemList, index) => {
            const innerItem = innerItemList[1];
            return `        <option value="${innerItem.label}" <?php if (isset($items['${item.inputName}']) && $items['${item.inputName}'] === '${innerItem.label}') echo "selected"; ?>>${innerItem.label}</option>`;
          })
        : [];

      mainList.push(
        `  <tr${userTr}>
    <th${userTh}>
      <label for="${item.labelFor}">${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      ${requiredList[1] || ''}
      <select name="items[${item.inputName}]" id="${item.inputId}">
        <option value="未選択" <?php if (isset($items['${
          item.inputName
        }}']) && $items['${
          item.inputName
        }}'] === '未選択') echo "selected"; ?>>未選択</option>
${innerItemList.join('\n')}
      </select>${memo(item.inputNote, 6)}
    </td>
  </tr>`
      );
    }

    if (item.type === 7) {
      const innerItemList = item.itemList
        ? Object.entries(item.itemList).map((innerItemList, index) => {
            const innerItem = innerItemList[1];
            const itemId = `${item.inputId}${index + 1}`;

            if (item.required === 'option1') {
              requiredList[1] = `<?php if (isset($error['${itemId}'])) echo '<p class="error-text">' . $error['${itemId}'] . '</p>'; ?>`;
            }

            return `        <li>
          <p>${innerItem.label}</p>
          ${requiredList[1] || ''}
          <input type="text" readonly name="items[${itemId}]" id="${itemId}" size="60"
            value="<?php if (isset($items['${itemId}'])) echo h($items['${itemId}']); ?>" placeholder='${
              innerItem.label
            }を入力してください'>
        </li>`;
          })
        : [];

      mainList.push(`  <tr${userTr}>
    <th${userTh}>
      <label>${item.nameJA}</label>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      <ul class="date-list">
${innerItemList.join('\n')}
      </ul>${memo(item.inputNote, 6)}
    </td>
  </tr>`);
    }

    if (item.type === 8) {
      let itemNameRequired = '（必須）';
      let itemIdRequired = 'file_reqd';

      if (item.required === 'option2') {
        itemNameRequired = '（任意）';
        itemIdRequired = 'file_opt';
      }

      mainList.push(`  <tr${userTr}>
    <th${userTh}>
      ${item.nameJA}${itemNameRequired}<br>
      <small class="upload-notice">
        <?php // サーバーの1ファイルあたりの最大許容サイズを取得して表示しています。?>
        ※1ファイルの最大容量：<?php echo $upload_max_size; ?>MBまで<br>
        ※添付可能ファイル<br>（jpeg、png、PDF、zip）<br>
        ※その他のファイルにつきましては<br>zipにまとめて添付ください。
      </small>
      ${requiredList[0] || ''}
    </th>
    <td${userTd}>
      <?php if (isset($error_postsize)) echo '<p class="error-text">' . $error_postsize . '</p>'; ?>
      <?php if (isset($error['${itemIdRequired}'])) echo '<p class="error-text">' . $error['${itemIdRequired}'] . '</p>'; ?>
      <div class="upload-item-wrap">
        <?php $name = $items['files']['local_name']['${itemIdRequired}'] ?: ''; ?>
        <input type="file" name="items[${itemIdRequired}]" accept="image/*,.pdf,.zip" id="${itemIdRequired}">
        <input type="hidden" name="items[${itemIdRequired}]" value="<?php echo $name; ?>">

        <div class="thumb">
          <?php if (strrchr($items['files']['local_name']['${itemIdRequired}'], '.') === '.pdf') { ?><img src="./img/pdf_image.jpg" alt="PDFファイル" loading="lazy">
          <?php } elseif (strrchr($items['files']['local_name']['${itemIdRequired}'], '.') === '.zip') { ?><img src="./img/zip_image.jpg" alt="zipファイル" loading="lazy">
          <?php } else { ?><img src="<?php echo $name ? './tmp/' . $name : './img/noimage.jpg'; ?>" alt="" loading="lazy"><?php } ?>
        </div>

        <div class="ancion-btn-wrap">
          <label for="${itemIdRequired}" class="ancion-btn select-file">ファイルを選択</label>
          <p class="ancion-btn deselect-file">ファイルを削除</p>
        </div>
      </div>${memo(item.inputNote, 6)}
    </td>
  </tr>`);
    }

    return mainList;
  });

  const generatedConfirmationCode = data.userFormList.map((item) => {
    const confirmList = [];

    if ([1, 2, 6].includes(item.type)) {
      confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}</th>
    <td${userTd}><?php if (isset($items['${item.inputName}'])) echo h($items['${item.inputName}']); ?></td>
  </tr>`);
    }

    if (item.type === 3) {
      confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}</th>
    <td${userTd}>
      〒 <?php if (isset($items['${item.inputPostalName1}'])) echo h($items['${item.inputPostalName1}']); ?> - <?php if (isset($items['${item.inputPostalName2}'])) echo h($items['${item.inputPostalName2}']); ?><br>
      <?php if (isset($items['${item.inputName}'])) echo h($items['${item.inputName}']); ?>
    </td>
  </tr>`);
    }

    if (item.type === 5) {
      if (item.inputType === 'checkbox') {
        confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}</th>
    <td${userTd}>
      <?php echo join('<br>', array_filter($items['${item.inputName}'], 'strlen')); ?>
    </td>
  </tr>`);
      }

      if (item.inputType === 'radio') {
        confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}</th>
    <td${userTd}><?php if (isset($items['${item.inputName}'])) echo h($items['${item.inputName}']); ?></td>
  </tr>`);
      }
    }

    if (item.type === 7) {
      const innerItemList = item.itemList
        ? Object.entries(item.itemList).map((innerItemList, index) => {
            const innerItem = innerItemList[1];
            const itemId = `${item.inputId}${index + 1}`;

            return `        <li>
          <p>${innerItem.label}</p>
          <?php if (isset($items['${itemId}'])) echo h($items['${itemId}']); ?>
        </li>`;
          })
        : [];

      confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}</th>
    <td${userTd}>
      <ul>
${innerItemList.join('\n')}
      </ul>
    </td>
  </tr>`);
    }

    if (item.type === 8) {
      let itemNameRequired = '（必須）';
      let itemIdRequired = 'file_reqd';

      if (item.required === 'option2') {
        itemNameRequired = '（任意）';
        itemIdRequired = 'file_opt';
      }

      confirmList.push(`  <tr${userTr}>
    <th${userTh}>${item.nameJA}${itemNameRequired}</th>
    <td${userTd}>
      <?php if ($items['files']['local_name']['${itemIdRequired}']) { ?>
        <?php if (strrchr($items['files']['local_name']['${itemIdRequired}'], '.') === '.pdf') { ?>
          <img src="./img/pdf_image.jpg" alt="" width="220" loading="lazy">
        <?php } elseif (strrchr($items['files']['local_name']['${itemIdRequired}'], '.') === '.zip') { ?>
          <img src="./img/zip_image.jpg" alt="" width="220" loading="lazy">
        <?php } else { ?>
          <img src="./tmp/<?php echo $items['files']['local_name']['${itemIdRequired}']; ?>" alt="" width="220" loading="lazy">
        <?php } ?>
      <?php } ?>
    </td>
  </tr>`);
    }

    return confirmList;
  });

  const updatedConfirmationCode = generatedConfirmationCode.filter(
    (val) => Object.keys(val).length !== 0
  );

  return (
    <div className="output">
      <button
        className="output__button output__button--word"
        onClick={openModal}
        disabled={!codeAvailable}
        data-tooltip-id="option-tooltip"
        data-tooltip-content={'Code Modal'}
      >
        <span className="material-symbols-outlined">
          {codeAvailable ? 'code' : 'code_off'}
        </span>
      </button>
      <Tooltip id="option-tooltip" />
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="output__modal"
        contentLabel="Output Modal"
      >
        <div className="output__top">
          <header className="output__header">
            <h3 className="output__title">お問い合わせコード</h3>
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
                <h3 className="output__item-title">1. Form Table</h3>
                <p className="output__item-description">
                  お問い合わせフォーム &lt;table&gt; コード
                </p>
              </header>
              <button
                className="output__button output__button--copy"
                onClick={() => copytToClipboard('main', generatedMainCode)}
                data-tooltip-id="copy-tooltip"
                data-tooltip-content={'コピー'}
                data-tooltip-place="left"
              >
                <span className="material-symbols-outlined">
                  {copyMain ? 'inventory' : 'integration_instructions'}
                </span>
              </button>
              <Tooltip id="copy-tooltip" />
            </div>
            <div className="output__item-code">
              <SyntaxHighlighter
                language="php-template"
                style={style}
                showLineNumbers
              >
                {mainOuputList(generatedMainCode).join('\n')}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="output__item">
            <div className="output__item-top">
              <header className="output__item-header">
                <h3 className="output__item-title">
                  2. Input Confirmation Table
                </h3>
                <p className="output__item-description">
                  入力内容の確認 &lt;table&gt; コード
                </p>
              </header>
              <button
                className="output__button output__button--copy"
                onClick={() =>
                  copytToClipboard('confirm', updatedConfirmationCode)
                }
                data-tooltip-id="copy-tooltip"
                data-tooltip-content={'コピー'}
                data-tooltip-place="left"
              >
                <span className="material-symbols-outlined">
                  {copyConfirm ? 'inventory' : 'integration_instructions'}
                </span>
              </button>
              <Tooltip id="copy-tooltip" />
            </div>
            <div className="output__item-code">
              <SyntaxHighlighter
                language="php-template"
                style={style}
                showLineNumbers
              >
                {mainOuputList(updatedConfirmationCode).join('\n')}
              </SyntaxHighlighter>
            </div>
          </div>
          {/* <p className="output__note">
            ※コードはの縮小版になっているため、エディタに貼り付けてフォーマットしてください。
          </p> */}
        </div>
      </ReactModal>
    </div>
  );
}
