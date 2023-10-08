import ReactModal from 'react-modal';
import { useState } from 'react';

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

export default function Output({ data }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const generateMainCode = () => {
    return <>TEsT</>;
  };

  const codeOutput = (code) => {
    return `<table class="contact-form-table">\n  ${code}\n</table>`;
  };

  return (
    <div className="output">
      <button className="output__button" onClick={openModal}>
        <span className="material-symbols-outlined">code</span>
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
            <h3 className="output__title">copy center</h3>
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
                  possimus?
                </p>
              </header>
              <button className="output__button">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
            <pre className="output__item-pre">
              <code className="output__item-code">
                &lt;table class="contact-form-table"&gt;
                {generateMainCode()}
                &lt;/table&gt;
              </code>
            </pre>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
