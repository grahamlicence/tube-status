const popup = {
  initCloseBtn: () => {
    document.querySelector('.popupclosebtn').addEventListener('click', (e) => {
      e.preventDefault();
      window.close();
    });
  },

  setLastUpdated: (time) => {
    clearInterval(popup.timer);
    const lastUpdated = document.querySelector('.last-updated');

    const updateTime = () => {
      lastUpdated.innerHTML = helpers.minutesAgo(time).text;
    };

    updateTime();

    popup.timer = setInterval(() => updateTime(), 1000);
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

    this.data.map((item) => {
      const lineButton = document.querySelector(
        `.${item.line.toLowerCase().replace(/\s/g, '-').replace(/\&/g, 'and')} button`,
      );

      lineButton.innerHTML = `
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
      `;
      lineButton.className = `toggle-btn ${item.active ? '' : 'off'}`;
    });
  },

  updateWithData: () => {
    const data = JSON.parse(localStorage.getItem('lineData'));
    const updated = data.filter((item) => !!item.updated);
    // passing the updated value up
    this.data = data.filter((item) => !item.updated);

    popup.populateLines();
    popup.setLastUpdated(updated[0].updated);
  },

  listenToToggle: () => {
    const lines = document.querySelectorAll('.lines button');
    console.log(lines);

    [].map.call(lines, (line) => {
      console.log(line);
      line.addEventListener('click', (e) => {
        console.log('clicked on', line.getAttribute('data-type'));
      });
    });
  },

  initPopup: () => {
    popup.updateWithData();
    popup.listenToToggle();

    // listener for background data updates
    chrome.runtime.onMessage.addListener((request) => {
      if (request.msg === 'dataupdate') {
        popup.updateWithData();
      }
    });
  },
};

popup.initCloseBtn();
popup.initPopup();
