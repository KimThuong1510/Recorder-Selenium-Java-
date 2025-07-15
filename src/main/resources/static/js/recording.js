class SeleniumIDEDetailed {
        constructor() {
            this.currentTest = 'Untitled';
            this.commands = [
                { command: 'open', target: 'https://example.com', value: '' },
                { command: 'set window size', target: '1920x1080', value: '' },
                { command: 'click', target: 'id=login-button', value: '' },
                { command: 'type', target: 'id=username', value: 'testuser' },
                { command: 'type', target: 'id=password', value: 'password123' },
                { command: 'click', target: 'css=button[type="submit"]', value: '' },
                { command: 'wait for element visible', target: 'css=.dashboard', value: '5000' },
                { command: 'assert text', target: 'css=h1', value: 'Welcome' },
                { command: 'click', target: 'css=.logout-btn', value: '' },
                { command: 'close', target: '', value: '' }
            ];
            this.selectedRow = 1; // 0-based index

            this.initializeElements();
            this.bindEvents();
            this.updateForm();
        }

        initializeElements() {
            this.commandTableBody = document.getElementById('commandTableBody');
            this.commandSelect = document.getElementById('commandSelect');
            this.targetInput = document.getElementById('targetInput');
            this.valueInput = document.getElementById('valueInput');
            this.descriptionInput = document.getElementById('descriptionInput');
            this.addTestBtn = document.getElementById('addTestBtn');
        }

        bindEvents() {
            // Table row selection
            this.commandTableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    this.selectRow(Array.from(row.parentNode.children).indexOf(row));
                }
            });

            // Form updates
            this.commandSelect.addEventListener('change', () => {
                this.updateCommand();
            });

            this.targetInput.addEventListener('input', () => {
                this.updateTarget();
            });

            this.valueInput.addEventListener('input', () => {
                this.updateValue();
            });

            // Add test button
            this.addTestBtn.addEventListener('click', () => {
                this.addNewCommand();
            });

            // Toolbar buttons
            document.querySelector('.icon-record').parentElement.addEventListener('click', () => {
                this.toggleRecord();
            });

            document.querySelector('.icon-play').parentElement.addEventListener('click', () => {
                this.playTest();
            });

            // Tab switching
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });

            document.getElementById('stopRecordingBtn').addEventListener('click', function() {
                fetch('/api/recorder/stop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    })
                })
                .then(response => response.json())
                .then(data => {
                    loadRecordList(); 
                });
            });
        }

        selectRow(index) {
            document.querySelectorAll('.command-table tr').forEach(row => {
                row.classList.remove('selected');
            });

            const rows = this.commandTableBody.querySelectorAll('tr');
            if (rows[index]) {
                rows[index].classList.add('selected');
                this.selectedRow = index;
                this.updateForm();

                rows[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }

        updateForm() {
            if (this.commands[this.selectedRow]) {
                const cmd = this.commands[this.selectedRow];
                this.commandSelect.value = cmd.command;
                this.targetInput.value = cmd.target;
                this.valueInput.value = cmd.value;
            }
        }

        updateCommand() {
            if (this.commands[this.selectedRow]) {
                this.commands[this.selectedRow].command = this.commandSelect.value;
                this.updateTableRow();
            }
        }

        updateTarget() {
            if (this.commands[this.selectedRow]) {
                this.commands[this.selectedRow].target = this.targetInput.value;
                this.updateTableRow();
            }
        }

        updateValue() {
            if (this.commands[this.selectedRow]) {
                this.commands[this.selectedRow].value = this.valueInput.value;
                this.updateTableRow();
            }
        }

        updateTableRow() {
            const rows = this.commandTableBody.querySelectorAll('tr');
            const row = rows[this.selectedRow];
            const cmd = this.commands[this.selectedRow];

            if (row && cmd) {
                row.cells[1].textContent = cmd.command;
                row.cells[2].textContent = cmd.target;
                row.cells[3].textContent = cmd.value;
            }
        }

        addNewCommand() {
            const newIndex = this.commands.length + 1;
            const newCommand = { command: 'click', target: '', value: '' };
            this.commands.push(newCommand);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="row-number">${newIndex}</td>
                <td>${newCommand.command}</td>
                <td>${newCommand.target}</td>
                <td>${newCommand.value}</td>
            `;
            this.commandTableBody.appendChild(row);

            this.selectRow(this.commands.length - 1);
        }

        toggleRecord() {
            const btn = document.querySelector('.icon-record').parentElement;
            btn.classList.toggle('active');
        }

        playTest() {
            const btn = document.querySelector('.icon-play').parentElement;
            btn.classList.add('active');
            setTimeout(() => {
                btn.classList.remove('active');
            }, 2000);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
                  new SeleniumIDEDetailed();
              });

              document.addEventListener('DOMContentLoaded', function () {
                  const menuButtons = document.querySelectorAll('.menu-button');

                  menuButtons.forEach(btn => {
                      btn.addEventListener('click', function (e) {
                          const menu = btn.nextElementSibling;

                          // Ẩn tất cả các popup khác
                          document.querySelectorAll('.context-menu').forEach(m => {
                              if (m !== menu) m.classList.remove('show');
                          });

                          menu.classList.toggle('show');

                          // Ngăn chặn propagation để click ngoài không đóng ngay
                          e.stopPropagation();
                      });
                  });

                  // Đóng popup khi click bên ngoài
                  document.addEventListener('click', function () {
                      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('show'));
                  });
              });

              document.addEventListener("DOMContentLoaded", function () {
                  const exportBtn = document.getElementById("openExportModal");
                  const modal = document.getElementById("exportModal");
                  const cancelBtn = document.getElementById("cancelExport");
                  const closeBtn = document.getElementById("closeExport");
                  const exportSubmitBtn = document.getElementById("exportBtn");
                  const testNameInput = document.getElementById("exportTestName");
                  const downloadButtons = document.getElementById("downloadButtons");
                  const downloadXmlBtn = document.getElementById("downloadXmlBtn");
                  const downloadJavaBtn = document.getElementById("downloadJavaBtn");

                  // Debug: Kiểm tra các elements
                  console.log("Export elements found:", {
                      exportBtn: !!exportBtn,
                      modal: !!modal,
                      cancelBtn: !!cancelBtn,
                      closeBtn: !!closeBtn,
                      exportSubmitBtn: !!exportSubmitBtn,
                      testNameInput: !!testNameInput,
                      downloadButtons: !!downloadButtons,
                      downloadXmlBtn: !!downloadXmlBtn,
                      downloadJavaBtn: !!downloadJavaBtn
                  });

                  // Mở modal export
                  if (exportBtn) {
                      exportBtn.addEventListener("click", function () {
                          console.log("Export button clicked");
                          modal.classList.remove("hidden");
                          testNameInput.focus();
                      });
                  } else {
                      console.error("Export button not found!");
                  }

                  // Đóng modal
                  function closeModal() {
                      modal.classList.add("hidden");
                      testNameInput.value = '';
                      downloadButtons.style.display = 'none';
                      exportSubmitBtn.style.display = 'inline-block';
                  }

                  cancelBtn.addEventListener("click", closeModal);
                  if (closeBtn) {
                      closeBtn.addEventListener("click", closeModal);
                  }

                  // Xử lý export
                  if (exportSubmitBtn) {
                      exportSubmitBtn.addEventListener("click", function () {
                          const testName = testNameInput.value.trim();
                          if (!testName) {
                              alert("Vui lòng nhập tên test case!");
                              testNameInput.focus();
                              return;
                          }
                          const selectedLang = document.querySelector('input[name="lang"]:checked').value;
                          fetch('/export-testng', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/x-www-form-urlencoded',
                              },
                              body: `testName=${encodeURIComponent(testName)}`
                          })
                          .then(response => {
                              if (response.ok) {
                                  if (selectedLang === "java-junit") {
                                      window.open(`/download-testng-java?testName=${encodeURIComponent(testName)}`, '_blank');
                                  } else if (selectedLang === "xml") {
                                      window.open(`/download-testng-xml?testName=${encodeURIComponent(testName)}`, '_blank');
                                  }
                                  // Cập nhật tên test case ở sidebar
                                  const testItem = document.querySelector('.test-item.active');
                                  if (testItem) {
                                      testItem.textContent = testName;
                                  }
                                  closeModal();
                              } else {
                                  alert("Có lỗi xảy ra khi export!");
                              }
                          })
                          .catch(error => {
                              console.error('Error:', error);
                              alert("Có lỗi xảy ra khi export!");
                          });
                      });
                  } else {
                      console.error("Export submit button not found!");
                  }

                  // Enter key để submit
                  if (testNameInput) {
                      testNameInput.addEventListener("keypress", function(e) {
                          if (e.key === "Enter") {
                              exportSubmitBtn.click();
                          }
                      });
                  }
              });

          document.addEventListener("DOMContentLoaded", function () {
          const renameModal = document.getElementById("renameModal");
          const openRenameBtn = document.getElementById("openRenameModal"); // Gắn ID vào nút Rename trong context menu
          const closeRenameBtn = document.getElementById("closeRename");
          const cancelRenameBtn = document.getElementById("cancelRename");
          const confirmRenameBtn = document.getElementById("confirmRename");
          const renameInput = document.getElementById("renameInput");

          let currentTestItem = null;

          if (openRenameBtn) {
              openRenameBtn.addEventListener("click", function () {
                  currentTestItem = document.querySelector('.test-item.active'); // hoặc item nào đang chọn
                  renameInput.value = currentTestItem?.textContent.trim() || "Untitled";
                  renameModal.classList.remove("hidden");
              });
          }

          closeRenameBtn.addEventListener("click", () => renameModal.classList.add("hidden"));
          cancelRenameBtn.addEventListener("click", () => renameModal.classList.add("hidden"));

          confirmRenameBtn.addEventListener("click", function () {
              const newName = renameInput.value.trim();
              if (newName && currentTestItem) {
                  currentTestItem.textContent = newName;
              }
              renameModal.classList.add("hidden");

              // MỞ MODAL EXPORT NGAY SAU KHI ĐỔI TÊN
              modal.classList.remove("hidden");
              testNameInput.value = newName;
              testNameInput.focus();
          });
      });

      // Polling kiểm tra trạng thái session
      function checkSessionStatus() {
          fetch('/session-status')
              .then(response => response.text())
              .then(status => {
                  if (status === 'closed') {
                      // Hiển thị thông báo và chuyển về trang chủ
                      alert('Trình duyệt record đã bị đóng. Các thao tác đã được ghi nhận!');
                      window.location.href = '/';
                  }
              });
      }
      setInterval(checkSessionStatus, 2000);
