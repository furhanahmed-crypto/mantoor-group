/* ═══════════════════════════════════════════
   BROCHURE LEAD CAPTURE + ONGOING PROJECTS RENDER
   ═══════════════════════════════════════════ */
'use strict';

(function () {
  let activeProject = null;

  document.addEventListener('DOMContentLoaded', () => {
    ensureBrochureModal();
    renderOngoingProjects();
    bindBrochureTriggers();
  });

  function rootPrefixFrom(el) {
    return (el && el.dataset.rootPrefix) || '';
  }

  function resolve(rootPrefix, path) {
    if (!path) return '';
    return rootPrefix + path;
  }

  function pageHref(rootPrefix, slug) {
    if (rootPrefix === '../') return slug;
    return 'pages/' + slug;
  }

  /* ── Render project cards ── */
  function renderOngoingProjects() {
    const grids = document.querySelectorAll('#ongoingProjectsGrid');
    if (!grids.length || !window.ONGOING_PROJECTS) return;

    grids.forEach((grid) => {
      const rootPrefix = rootPrefixFrom(grid);
      grid.innerHTML = '';

      window.ONGOING_PROJECTS.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card reveal';

        const imgUrl = resolve(rootPrefix, project.image);
        const imgHtml = project.image
          ? `<div class="project-img-bg" style="background-image:url('${imgUrl}');background-size:cover;background-position:center;"></div>`
          : project.imageClass
            ? `<div class="project-img-bg ${project.imageClass}"></div>`
            : `<img src="" alt="${escapeHtml(project.name)}" />`;

        const featuresHtml = (project.features || [])
          .map(
            (f) =>
              `<span><i class="fas ${f.icon}"></i> ${escapeHtml(f.label)}</span>`
          )
          .join('');

        card.innerHTML = `
          <div class="project-card-img">
            ${imgHtml}
            <div class="project-badge-tag">${escapeHtml(project.badge)}</div>
          </div>
          <div class="project-card-body">
            <div class="project-card-meta">
              <i class="fas fa-map-marker-alt"></i>
              <span>${escapeHtml(project.location)}</span>
            </div>
            <h3 class="project-card-title">${escapeHtml(project.name)}</h3>
            <p class="project-card-desc">${escapeHtml(project.description)}</p>
            <div class="project-features">${featuresHtml}</div>
            <div class="project-card-actions">
              <a href="${pageHref(rootPrefix, project.slug)}" class="project-cta">
                View Project <i class="fas fa-arrow-right"></i>
              </a>
              <button
                type="button"
                class="project-brochure-btn"
                data-project-id="${escapeHtml(project.id)}"
              >
                <i class="fas fa-download"></i> Download Brochure
              </button>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    });
  }

  function bindBrochureTriggers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-project-id].project-brochure-btn, .project-brochure-btn[data-project-id]');
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.projectId;
      const project = (window.ONGOING_PROJECTS || []).find((p) => p.id === id);
      if (!project) return;

      const grid = btn.closest('#ongoingProjectsGrid') || document.querySelector('#ongoingProjectsGrid');
      const rootPrefix = rootPrefixFrom(grid);
      openBrochureModal(project, rootPrefix);
    });
  }

  /* ── Modal markup ── */
  function ensureBrochureModal() {
    if (document.getElementById('brochureModal')) return;

    const wrap = document.createElement('div');
    wrap.id = 'brochureModal';
    wrap.className = 'brochure-modal';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `
      <div class="brochure-modal-backdrop" data-brochure-close></div>
      <div class="brochure-modal-panel" role="dialog" aria-modal="true" aria-labelledby="brochureModalTitle">
        <button type="button" class="brochure-modal-close" data-brochure-close aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <div class="brochure-modal-header">
          <span class="brochure-modal-label">Download Brochure</span>
          <h3 id="brochureModalTitle">Get the project brochure</h3>
          <p class="brochure-modal-sub">Share your details and we’ll send the brochure your way.</p>
        </div>
        <form id="brochureForm" class="brochure-form" novalidate>
          <div class="form-group">
            <label for="brochureName">Full Name *</label>
            <input type="text" id="brochureName" name="name" autocomplete="name" placeholder="Your full name" required />
            <span class="form-error" id="brochureNameError"></span>
          </div>
          <div class="form-group">
            <label for="brochurePhone">Phone Number *</label>
            <input type="tel" id="brochurePhone" name="phone" autocomplete="tel" placeholder="10-digit mobile number" required />
            <span class="form-error" id="brochurePhoneError"></span>
          </div>
          <div class="form-group">
            <label for="brochureEmail">Email *</label>
            <input type="email" id="brochureEmail" name="email" autocomplete="email" placeholder="you@example.com" required />
            <span class="form-error" id="brochureEmailError"></span>
          </div>
          <div class="form-group">
            <label for="brochureProject">Project</label>
            <input type="text" id="brochureProject" name="project" readonly tabindex="-1" />
          </div>
          <div class="form-group">
            <label for="brochureRemarks">Remarks</label>
            <textarea id="brochureRemarks" name="remarks" rows="3" placeholder="Anything you’d like us to know (optional)"></textarea>
          </div>
          <button type="submit" class="btn-primary form-submit brochure-submit">
            <span>Submit &amp; Download</span>
            <i class="fas fa-download"></i>
          </button>
          <p class="form-note"><i class="fas fa-lock"></i> Your details are only used to share project information.</p>
        </form>
      </div>
    `;
    document.body.appendChild(wrap);

    wrap.querySelectorAll('[data-brochure-close]').forEach((el) => {
      el.addEventListener('click', closeBrochureModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrap.classList.contains('open')) closeBrochureModal();
    });

    document.getElementById('brochureForm').addEventListener('submit', onBrochureSubmit);
  }

  function openBrochureModal(project, rootPrefix) {
    activeProject = { ...project, rootPrefix: rootPrefix || '' };
    const modal = document.getElementById('brochureModal');
    const form = document.getElementById('brochureForm');
    form.reset();
    clearBrochureErrors();
    document.getElementById('brochureProject').value = project.name;
    document.getElementById('brochureModalTitle').textContent =
      'Brochure — ' + project.name;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('brochureName').focus(), 50);
  }

  function closeBrochureModal() {
    const modal = document.getElementById('brochureModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeProject = null;
  }

  function clearBrochureErrors() {
    ['brochureName', 'brochurePhone', 'brochureEmail'].forEach((id) => {
      const el = document.getElementById(id);
      const err = document.getElementById(id + 'Error');
      if (el) el.classList.remove('error');
      if (err) {
        err.textContent = '';
        err.classList.remove('visible');
      }
    });
  }

  function validateBrochureForm() {
    clearBrochureErrors();
    let ok = true;
    const checks = [
      {
        id: 'brochureName',
        errId: 'brochureNameError',
        check: (v) => v.trim().length >= 2,
        msg: 'Please enter your full name.',
      },
      {
        id: 'brochurePhone',
        errId: 'brochurePhoneError',
        check: (v) => v.replace(/\D/g, '').length >= 10,
        msg: 'Please enter a valid 10-digit number.',
      },
      {
        id: 'brochureEmail',
        errId: 'brochureEmailError',
        check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Please enter a valid email.',
      },
    ];

    checks.forEach(({ id, errId, check, msg }) => {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!check(el.value)) {
        el.classList.add('error');
        err.textContent = msg;
        err.classList.add('visible');
        ok = false;
      }
    });
    return ok;
  }

  function onBrochureSubmit(e) {
    e.preventDefault();
    if (!validateBrochureForm() || !activeProject) return;

    const name = document.getElementById('brochureName').value.trim();
    const phone = document.getElementById('brochurePhone').value.trim();
    const email = document.getElementById('brochureEmail').value.trim();
    const remarks = document.getElementById('brochureRemarks').value.trim();
    const projectName = activeProject.name;
    const rootPrefix = activeProject.rootPrefix || '';
    const brochureUrl = resolve(rootPrefix, activeProject.brochure);
    const fileName = activeProject.brochure.split('/').pop();
    const sendUrl = resolve(rootPrefix, 'send.php');

    const btn = document.querySelector('#brochureForm .brochure-submit');
    const btnLabel = btn && btn.querySelector('span');
    if (btn) btn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Sending…';

    const data = new FormData();
    data.append('name', name);
    data.append('phone', phone);
    data.append('email', email);
    data.append('project', projectName);
    data.append('remarks', remarks);

    fetch(sendUrl, { method: 'POST', body: data })
      .then((res) => res.json().catch(() => ({ success: false, message: 'Invalid server response' })))
      .then((result) => {
        if (!result || !result.success) {
          throw new Error((result && result.message) || 'Failed to send enquiry');
        }
        triggerDownload(brochureUrl, fileName);
        closeBrochureModal();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        if (btn) btn.disabled = false;
        if (btnLabel) btnLabel.textContent = 'Submit & Download';
      });
  }

  function triggerDownload(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || '';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
