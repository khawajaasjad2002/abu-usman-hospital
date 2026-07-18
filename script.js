// Abu Usman Hospital — vanilla JS
(function () {
  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileNav');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  // Doctor "Read more" toggles
  document.querySelectorAll('.dc-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = btn.previousElementSibling;
      var expanded = btn.getAttribute('data-expanded') === 'true';
      if (expanded) {
        p.textContent = p.getAttribute('data-short');
        btn.innerHTML = 'Read more <i class="fa-solid fa-chevron-down"></i>';
      } else {
        p.textContent = p.getAttribute('data-full');
        btn.innerHTML = 'Read less <i class="fa-solid fa-chevron-up"></i>';
      }
      btn.setAttribute('data-expanded', expanded ? 'false' : 'true');
    });
  });

  // Testimonial carousels
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.tm-track');
    var slides = root.querySelectorAll('.tm-slide');
    var dots = root.querySelectorAll('.tm-dot');
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }
    function update() {
      if (index > maxIndex()) index = maxIndex();
      var slide = slides[0];
      if (!slide) return;
      var gap = 20; // matches CSS gap
      var w = slide.getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * w) + 'px)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
    }
    root.querySelectorAll('.tm-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-dir');
        var mx = maxIndex();
        if (dir === 'next') { index = index >= mx ? 0 : index + 1; }
        else { index = index <= 0 ? mx : index - 1; }
        update();
      });
    });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var i = parseInt(d.getAttribute('data-i'), 10);
        if (i <= maxIndex()) { index = i; update(); }
      });
    });
    window.addEventListener('resize', update);
    // auto-advance
    setInterval(function () {
      var mx = maxIndex();
      index = index >= mx ? 0 : index + 1;
      update();
    }, 6000);
    update();
  });

  // Appointment form → opens mailto
  var form = document.getElementById('appointmentForm');
  if (form) {
    var branchNames = {};
    form.querySelectorAll('#branch option').forEach(function (o) {
      if (o.value) branchNames[o.value] = o.textContent;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString();
      var phone = (data.get('phone') || '').toString();
      var email = (data.get('email') || '').toString();
      var branchId = (data.get('branch') || '').toString();
      var message = (data.get('message') || '').toString();
      var subject = 'Appointment Request — ' + (name || 'New Patient');
      var body = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + email,
        'Branch: ' + (branchNames[branchId] || branchId),
        '',
        'Message:',
        message
      ].join('\n');
      var mailto = 'mailto:abuusmanhosp@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      var status = document.getElementById('formStatus');
      if (status) status.textContent = 'Opening your email app… Please send the prefilled email to abuusmanhosp@gmail.com to complete your request.';
      form.reset();
    });
  }
})();
