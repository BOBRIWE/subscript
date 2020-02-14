require('./index.css').toString();

class Subscript {
    /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return 'subscript';
  };

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({api}) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'SUB';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, Subscript.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let subscript = document.createElement(this.tag);

    subscript.classList.add(Subscript.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    subscript.appendChild(range.extractContents());
    range.insertNode(subscript);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(subscript);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Subscript.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 640 640"><path fill-rule="nonzero" d="M282.594 213.215L406.836 397.54c20.622 30.485 35.245 49.075 43.973 55.654 8.728 6.46 19.158 10.43 31.063 11.788v12.248h-219.57v-12.248c17.564-1.359 28.784-4.087 33.887-8.044 5.102-3.968 7.712-8.846 7.712-14.622 0-3.968-.791-7.488-2.386-10.547-3.059-6.685-10.878-19.04-23.244-37.3l-65.741-97.265-68.694 84.013c-20.634 25.5-30.945 42.733-30.945 51.804 0 6.46 2.717 12.46 7.937 18.012 5.327 5.445 13.264 9.531 23.575 11.905 4.654 1.359 14.174 2.044 28.56 2.044v12.248H-.012v-12.248c19.724-2.953 35.244-8.28 46.476-15.98 14.847-10.206 35.588-31.395 62.115-63.817l89.328-108.828-114.604-168.45C64.488 80.244 53.823 64.83 51.106 61.771c-6-7.264-11.787-12.473-17.575-15.65-5.776-3.059-13.713-5.433-23.906-6.91V26.859h223.538v12.355h-11.338c-12.804 0-21.757 2.031-26.86 6.118-5.101 4.075-7.712 9.177-7.712 15.425 0 4.866.792 9.06 2.386 12.58l22.89 34.57 55.772 85.017 47.493-58.146c24.378-29.812 36.508-50.788 36.508-62.694 0-6-1.7-11.563-5.102-16.665-3.402-5.103-8.386-9.071-14.729-11.894-6.472-2.953-16.453-4.311-29.94-4.311V26.858h165.733v12.355c-13.04.224-23.575 1.807-31.512 4.76-8.043 3.059-16.547 8.622-25.618 16.783-5.788 5.327-20.174 21.875-43.194 49.536l-85.347 102.923zm344.721 399.926H494.794v-3.626c40.701-48.414 65.292-80.942 74.032-97.714 8.61-16.665 13.028-32.988 13.028-48.969 0-11.563-3.626-21.2-10.772-28.902-7.252-7.713-16.098-11.575-26.41-11.575-17.114 0-30.271 8.504-39.673 25.512l-6.236-2.161c6.011-21.19 15.082-36.945 27.319-47.15 12.13-10.087 26.185-15.19 42.166-15.19 11.338 0 21.768 2.61 31.181 7.938 9.402 5.326 16.772 12.579 22.099 21.874 5.338 9.177 7.937 17.917 7.937 25.96 0 14.73-4.087 29.694-12.248 44.777-11.22 20.516-35.587 49.087-73.23 85.702h48.639c12.012 0 19.725-.46 23.35-1.477 3.627-1.027 6.568-2.728 8.847-5.102 2.374-2.386 5.433-7.37 9.177-14.965h6.012l-12.697 65.068z"/></svg>';
  }

  /**
   * Sanitizer rule
   * @return {{sub: {class: string}}}
   */
  static get sanitize() {
    return {
      sub: {
        class: Subscript.CSS
      }
    };
  }
}

module.exports = Subscript;