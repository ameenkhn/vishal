/*
 * Healthy Chest & Sleep Clinic — modern interactions
 * Lightweight vanilla JS for header, drawer, FAQ, counters, reveal, etc.
 */
(function(){
  'use strict';

  // -------- Preloader
  window.addEventListener('load', function(){
    var pre = document.querySelector('.preloader');
    if(!pre) return;
    setTimeout(function(){
      pre.classList.add('is-hidden');
      setTimeout(function(){ pre.remove(); }, 700);
    }, 350);
  });

  document.addEventListener('DOMContentLoaded', function(){

    // -------- Sticky header shadow on scroll
    var header = document.querySelector('.site-header');
    var fab = document.querySelector('.fab.scroll-top');
    function onScroll(){
      var y = window.scrollY || document.documentElement.scrollTop;
      if(header) header.classList.toggle('scrolled', y > 8);
      if(fab) fab.classList.toggle('show', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    // -------- Mobile drawer
    var drawer   = document.querySelector('.drawer');
    var overlay  = document.querySelector('.drawer-overlay');
    var openBtn  = document.querySelector('.menu-toggle');
    var closeBtn = document.querySelector('.drawer-close');
    function openDrawer(){
      if(!drawer) return;
      drawer.classList.add('open');
      if(overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer(){
      if(!drawer) return;
      drawer.classList.remove('open');
      if(overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    if(openBtn) openBtn.addEventListener('click', openDrawer);
    if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if(overlay) overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeDrawer();
    });

    // -------- Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(href.length < 2) return;
        var target = document.querySelector(href);
        if(!target) return;
        e.preventDefault();
        var offset = 90;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top:top, behavior:'smooth' });
      });
    });

    // -------- FAQ accordion
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if(!q || !a) return;
      q.addEventListener('click', function(){
        var open = item.classList.toggle('is-open');
        if(open){
          a.style.maxHeight = a.scrollHeight + 'px';
        } else {
          a.style.maxHeight = '0px';
        }
      });
    });

    // -------- Counter animation
    var counters = document.querySelectorAll('[data-count]');
    function animateCount(el){
      var target = parseFloat(el.dataset.count);
      var dur = parseInt(el.dataset.duration || '1500', 10);
      var start = null;
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
        var val = target * ease;
        var formatted;
        if(target % 1 === 0){
          formatted = Math.round(val).toLocaleString();
        } else {
          formatted = val.toFixed(1);
        }
        el.textContent = prefix + formatted + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // -------- Reveal on scroll + counter trigger
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('in');
        if(en.target.matches('[data-count]') && !en.target.dataset.counted){
          en.target.dataset.counted = '1';
          animateCount(en.target);
        }
        io.unobserve(en.target);
      });
    }, { threshold:0.15, rootMargin:'0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    counters.forEach(function(el){ io.observe(el); });

    // -------- Marquee duplication for seamless loop
    document.querySelectorAll('.marquee-track').forEach(function(track){
      track.innerHTML += track.innerHTML;
    });

    // -------- Mark active nav link based on URL
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a, .drawer nav a').forEach(function(a){
      var href = (a.getAttribute('href') || '').toLowerCase();
      if(href === path) a.classList.add('is-active');
      if(path === '' && href === 'index.html') a.classList.add('is-active');
    });

    // -------- Contact form (front-end only feedback)
    var form = document.querySelector('[data-contact-form]');
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var ok = form.querySelector('[data-form-success]');
        var btn = form.querySelector('button[type="submit"]');
        var originalLabel = btn ? btn.innerHTML : '';
        if(btn){ btn.disabled = true; btn.innerHTML = 'Sending...'; }
        setTimeout(function(){
          if(ok){ ok.style.display = 'flex'; }
          form.reset();
          if(btn){ btn.disabled = false; btn.innerHTML = originalLabel; }
          setTimeout(function(){ if(ok) ok.style.display = 'none'; }, 6000);
        }, 900);
      });
    }
  });
})();
