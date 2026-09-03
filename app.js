/**
 * Hack2skill Innovation Dinner (Bangalore Edition II)
 * Client Interactivity, Calendar Integration & Ambient Motion
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initAmbientStars();
  initCalendarIntegrations();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Header Scroll Styling
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   Ambient Stardust Canvas Animation
   -------------------------------------------------------------------------- */
function initAmbientStars() {
  const canvas = document.getElementById('ambient-stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.speedY = -(Math.random() * 0.25 + 0.08);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      this.isGold = Math.random() > 0.35;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      this.alpha += this.pulseSpeed * this.pulseDir;
      if (this.alpha >= 0.75) this.pulseDir = -1;
      if (this.alpha <= 0.15) this.pulseDir = 1;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold 
        ? `rgba(223, 186, 90, ${this.alpha})`
        : `rgba(215, 195, 255, ${this.alpha * 0.8})`;
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = this.isGold ? 'rgba(223, 186, 90, 0.4)' : 'rgba(139, 92, 246, 0.3)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   Calendar Event Generators (Google Calendar & .ics Download)
   -------------------------------------------------------------------------- */
function initCalendarIntegrations() {
  const eventDetails = {
    title: 'Hack2skill Innovation Dinner · Edition II (Bengaluru)',
    description: 'By Private Invitation Only. Strictly curated dinner salon for 30–35 technology leaders, GCC heads, and founders.\n\nTime: 7:00 PM – 11:00 PM IST\nVenue: Private 5-Star Luxury Pavilion, Central Bengaluru (Confidential coordinates delivered via concierge)\nRSVP & Concierge: support@hack2skill.com',
    location: 'Central Business District, Bengaluru, Karnataka, India',
    startUTC: '20260930T133000Z', // 7:00 PM IST on 30 Sep 2026 is 13:30 UTC
    endUTC: '20260930T173000Z',   // 11:00 PM IST is 17:30 UTC
  };

  // Google Calendar URL
  function openGoogleCalendar() {
    const gcalUrl = new URL('https://calendar.google.com/calendar/render');
    gcalUrl.searchParams.append('action', 'TEMPLATE');
    gcalUrl.searchParams.append('text', eventDetails.title);
    gcalUrl.searchParams.append('dates', `${eventDetails.startUTC}/${eventDetails.endUTC}`);
    gcalUrl.searchParams.append('details', eventDetails.description);
    gcalUrl.searchParams.append('location', eventDetails.location);
    window.open(gcalUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  // Apple / Outlook .ics File Download
  function downloadICS() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hack2skill//Innovation Dinner BLR//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${eventDetails.location}`,
      `DTSTART:${eventDetails.startUTC}`,
      `DTEND:${eventDetails.endUTC}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Innovation-Dinner-Bangalore-30Sep2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Bind Buttons
  const btnGcal = document.getElementById('add-google-cal');
  const btnIcs = document.getElementById('download-ics');
  const btnHeroCal = document.getElementById('add-calendar-hero');

  if (btnGcal) btnGcal.addEventListener('click', openGoogleCalendar);
  if (btnIcs) btnIcs.addEventListener('click', downloadICS);
  if (btnHeroCal) btnHeroCal.addEventListener('click', openGoogleCalendar);
}

/* --------------------------------------------------------------------------
   Smooth Anchor Navigation
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
