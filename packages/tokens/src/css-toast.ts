export function cssToastClasses(): string {
  return `.sw-toast {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  inset: unset;
  bottom: var(--sw-space-6);
  left: 50%;
  margin: 0;
  overflow: visible;
  pointer-events: none;
  position: fixed;
  translate: -50% 0;
  width: max-content;
}

.sw-toast:popover-open {
  animation: sw-toast-float var(--sw-motion-default) var(--sw-motion-easing);
}

.sw-toast-travel {
  bottom: auto;
  left: 0;
  top: 0;
  translate: var(--sw-toast-from-x) var(--sw-toast-from-y);
}

.sw-toast-travel:popover-open {
  animation: sw-toast-travel var(--sw-motion-travel)
    var(--sw-motion-travel-easing) forwards;
}

@keyframes sw-toast-float {
  from {
    opacity: 0;
    translate: -50% var(--sw-space-3);
  }
  to {
    opacity: 1;
    translate: -50% 0;
  }
}

@keyframes sw-toast-travel {
  0% {
    opacity: 1;
    scale: 0.6;
    translate: var(--sw-toast-from-x) var(--sw-toast-from-y);
  }
  16% {
    opacity: 1;
    scale: 1.2;
    translate: var(--sw-toast-from-x) var(--sw-toast-from-y);
  }
  42% {
    opacity: 1;
    scale: 1;
    translate: var(--sw-toast-to-x) var(--sw-toast-to-y);
  }
  78% {
    opacity: 1;
    scale: 1;
    translate: var(--sw-toast-to-x) var(--sw-toast-to-y);
  }
  100% {
    opacity: 0;
    scale: 0.94;
    translate: var(--sw-toast-to-x) var(--sw-toast-to-y);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sw-toast:popover-open,
  .sw-toast-travel:popover-open {
    animation: none;
  }

  .sw-toast-travel:popover-open {
    opacity: 1;
    scale: 1;
    translate: var(--sw-toast-to-x) var(--sw-toast-to-y);
  }
}`;
}

export function toastClassCatalog(): string[] {
  return ['sw-toast', 'sw-toast-travel'];
}
