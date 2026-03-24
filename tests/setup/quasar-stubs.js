// tests/setup/quasar-stubs.js
//
// Global stubs for Quasar components for Vitest + Vue Test Utils.
//
// WHY?
//  - Quasar components are not native DOM elements.
//  - shallowMount won't render them.
//  - Without stubs, wrapper.find('q-btn') returns nothing.
//  - With stubs, they become <button>, <div>, ... and are clickable.

export const quasarStubs = {
  'q-btn': {
    template: '<button class="q-btn"><slot /></button>'
  },
  'q-icon': {
    template: '<i class="q-icon"><slot /></i>'
  },
  'q-card': {
    template: '<div class="q-card"><slot /></div>'
  },
  'q-card-section': {
    template: '<div class="q-card-section"><slot /></div>'
  },
  'q-toolbar': {
    template: '<div class="q-toolbar"><slot /></div>'
  },
  'q-toolbar-title': {
    template: '<div class="q-toolbar-title"><slot /></div>'
  },
  'q-input': {
    template: '<input class="q-input" />'
  },
  'g-custom-button': {
    template: '<button class="g-custom-button"><slot /></button>'
  },

};

// Feel free to extend this list with other Quasar components you use.