
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../Icon';
// import './style.scss';
let width;
let position;
let container;
let defaultContent = 'This is a message';
let defaultDuration = 2000;
let types = ['info',  'loading', 'success', 'error', 'warning'];
let Toast = {
  show(content, duration, type) {
    if (!this.closeTimer) {
      this.createDiv(content, type);
    } else {
      this.setContent(content, type);
      clearTimeout(this.closeTimer);
    }
    this.remove(duration);
    return 3;
  },
  remove(duration) {
    this.closeTimer = setTimeout(() => {
      this.close();
      this.closeTimer = null;
    }, duration || defaultDuration);
  },
  createDiv(content, type) {
    this.getContainer();
    this.setContent(content, type);
  },
  getContainer() {
    container = container || document.createElement('div');
    document.body.appendChild(container);
  },
  close() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  },
  setContent(content, type) {
    let iconType = types[type];
    ReactDOM.render(
      <div className="toast"
        style={{
          'width': width,
          'top': position && position.top,
          'right': position && position.right,
          'bottom': position && position.bottom,
          'left': position && position.left }}>
        <Icon type={iconType}/>
        <span className={iconType !== 'info' ? 'content' : null}>{content || defaultContent}</span>
      </div>,
      container
    );
  }
};
export default {
  info(content, duration) {
    Toast.show(content, duration, 0);
  },
  loading(content, duration) {
    Toast.show(content, duration, 1);
  },
  success(content, duration) {
    Toast.show(content, duration, 2);
  },
  error(content, duration) {
    Toast.show(content, duration, 3);
  },
  warning(content, duration) {
    Toast.show(content, duration, 4);
  },
  close() {
    Toast.remove();
  },
  config(options) {
    if (!options.width) {
      width = options.width;
    }
    if (!options.duration) {
      defaultDuration = options.duration;
    }
    if (!options.getContainer) {
      container = options.getContainer;
    }
    if (!options.position) {
      position =  options.position;
    }
  }
};
