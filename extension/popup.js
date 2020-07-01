const popup = {
  initCloseBtn: () => {
    document.querySelector('.popupclosebtn').addEventListener('click', (e) => {
      e.preventDefault();
      window.close();
    });
  },

  setLastUpdated: (time) => {
    const lastUpdated = document.querySelector('.last-updated');

    const updateTime = () => {
      lastUpdated.innerHTML = helpers.minutesAgo(time).text;
    };

    updateTime();

    setInterval(() => updateTime(), 1000);
  },

  renderDetails: (details) => {
    return details
      .split('\n')
      .map((detail) => {
        if (detail.length > 0) {
          return `<span class="details">${detail}</span>`;
        }
      })
      .join(' ');
  },

  populateLines: () => {
    if (!this.data || !this.data.length) {
      return;
    }

    const lines = document.querySelector('.lines');

    this.data.map((item) => {
      const newLine = document.createElement('li');
      const newLineInfo = document.createElement('p');
      newLineInfo.className = item.line.toLowerCase().replace(/\s/g, '-').replace(/\&/g, 'and');

      newLineInfo.innerHTML = `
        <button
          type="button"
          class="toggle-btn ${item.active ? '' : 'off'}">

          <span class="line">${item.line}</span>

          <span class="status">
              ${item.description.map((desc) => {
                return `
                      <span class="status-item">${desc}</span>
                  `;
              })}
          </span>

          <span class="message">No updates set</span>
          <span class="toggle ${item.active ? 'on' : 'off'}"></span>

          <span class="details-wrapper">${item.details.map(popup.renderDetails)}</span>

        </button>
      `;

      newLine.append(newLineInfo);
      lines.append(newLine);
    });
  },

  initPopup: () => {
    const data = JSON.parse(localStorage.getItem('lineData'));
    const updated = data.filter((item) => !!item.updated);
    // passing the updated value up
    this.data = data.filter((item) => !item.updated);

    popup.populateLines();
    popup.setLastUpdated(updated[0].updated);
  },
};

popup.initCloseBtn();
popup.initPopup();
