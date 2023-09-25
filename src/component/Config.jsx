import { nanoid } from 'nanoid';

export default function Config({ data }) {
  const item = data.activeItem[0];

  if (item.id !== 'startPage') {
    const config = item.configuration;
    const isDefault = item.isDefault;

    /* --------------------------- Default (All Type) --------------------------- */
    const name = (
      <li className="config__item">
        <label className="item-label" htmlFor="config-name">
          &lt;label&gt;名
        </label>
        <input
          type="text"
          name="name-name"
          id='config-name'
          defaultValue={item.nameJA}
          disabled={isDefault}
          className="item-input"
        />
      </li>
    );

    const placeholder = (
      <li className="config__item">
        <label className="item-label" htmlFor="config-placeholder">
          プレースホルダ
        </label>
        <input
          type="text"
          name="config-placeholder"
          id='config-placeholder'
          defaultValue={config.inputPlaceholder}
          className="item-input"
        />
      </li>
    );

    const require = (
      <li className="config__item config__item--radio">
        <p className="item-title">必要フラグ</p>
        <input type="radio" id='config-require' name='config-require'/>
        <label htmlFor="config-require">true</label>
      </li>
    );

    /* -------------------------------------------------------------------------- */
    return (
      <section className="config">
        <div className="config__box">
          <span className="config__icon material-symbols-outlined">
            settings
          </span>
          <h3 className="config__title">Item Setting</h3>
        </div>
        <p className="config__title-note">
          <small>
            &lt;label&gt;名、&lt;input&gt; 要素の属性などの設定をこちらで変更
          </small>
        </p>
        <ul className="config__List">
          {require}
          {name}
          {placeholder}
        </ul>
      </section>
    );
  } else {
    return <>STARTPAGE</>;
  }
}
