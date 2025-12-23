    // === LÓGICA DO MODAL DE ANEXO (CORRETA) ===
    const btnAddAttachment = document.getElementById('btnAddAttachment');
    const attachmentModal = document.getElementById('attachmentModal');
    const closeModal = document.getElementById('closeModal');
    const modalCancel = document.getElementById('modalCancel');
    const modalAdd = document.getElementById('modalAdd');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const attachmentsList = document.getElementById('attachmentsList');

    // Abrir e fechar modal
    if(btnAddAttachment) {
      btnAddAttachment.addEventListener('click', () => attachmentModal.style.display = 'flex');
    }
    if(closeModal) {
      closeModal.addEventListener('click', () => attachmentModal.style.display = 'none');
    }
    if(modalCancel) {
      modalCancel.addEventListener('click', () => attachmentModal.style.display = 'none');
    }

    // Clique na área de upload
    if(uploadArea) {
      uploadArea.addEventListener('click', () => fileInput.click());
    }

    // Arrastar e soltar
    if(uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        // Opcional: atualizar texto para mostrar arquivos selecionados
      });
    }

    // Função para criar item de anexo
    function addAttachment(file) {
      const desc = document.getElementById('modalDesc').value || 'Sem descrição';
      const type = document.getElementById('modalType').value || 'Outro';
      const fileSize = (file.size / (1024 * 1024)).toFixed(1);
      const fileIcon = getFileIcon(file.type);
      const today = new Date().toLocaleDateString('pt-BR');

      const attachmentItem = document.createElement('div');
      attachmentItem.className = 'attachment-item';
      attachmentItem.innerHTML = `
        <div class="attachment-icon"><i class="${fileIcon}"></i></div>
        <div class="attachment-info">
          <div class="attachment-name">${file.name}</div>
          <div class="attachment-meta">
            <span><i class="far fa-calendar"></i> ${today}</span>
            <span><i class="fas fa-weight"></i> ${fileSize} MB</span>
          </div>
          <div class="attachment-desc">${desc}</div>
          <div class="attachment-type">${type}</div>
        </div>
        <div class="attachment-actions">
          <button class="btn-icon btn-download" title="Baixar"><i class="fas fa-download"></i></button>
          <button class="btn-icon btn-delete" title="Excluir"><i class="fas fa-trash"></i></button>
        </div>
      `;
      attachmentItem.querySelector('.btn-delete').addEventListener('click', () => {
        if(confirm('Deseja excluir este anexo?')) {
          attachmentItem.remove();
          // Verifica se a lista está vazia
          if(attachmentsList.children.length === 0) {
            attachmentsList.innerHTML = `
              <div class="empty-attachments">
                <i class="fas fa-file-excel"></i>
                <p>Nenhum anexo adicionado</p>
              </div>`;
          }
        }
      });
      
      // Remove o placeholder de "lista vazia"
      const emptyState = attachmentsList.querySelector('.empty-attachments');
      if(emptyState) {
        emptyState.remove();
      }
      
      attachmentsList.appendChild(attachmentItem);
    }

    function getFileIcon(fileType) {
      if(fileType.includes('pdf')) return 'fas fa-file-pdf';
      if(fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
      if(fileType.includes('image')) return 'fas fa-file-image';
      return 'fas fa-file';
    }

    // Adicionar anexos ao clicar no botão
    if(modalAdd) {
      modalAdd.addEventListener('click', () => {
        if(!fileInput.files.length) {
          alert('Selecione um arquivo');
          return;
        }
        Array.from(fileInput.files).forEach(file => addAttachment(file));

        // Reset modal
        fileInput.value = '';
        document.getElementById('modalDesc').value = '';
        document.getElementById('modalType').value = '';
        attachmentModal.style.display = 'none';
      });
    }

    // === LÓGICA DAS ABAS (MOVIDA PARA CÁ) ===
    function switchTab(tabName) {
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
      
      document.getElementById('tab-' + tabName).classList.add('active');
      // Encontra o botão correto para ativar
      document.querySelector(`.tab-nav-btn[onclick="switchTab('${tabName}')"]`).classList.add('active');
    }
    