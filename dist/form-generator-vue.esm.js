var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    schema: {
      type: Object,
      default: () => ({})
    }
  }
};

const UTILS = {
  isUndef(val) {
    return typeof val === 'undefined';
  },

  isObjOnly(val) {
    if (!UTILS.isArr(val)) {
      return UTILS.isObj(val);
    }

    return val.every(v => UTILS.isObj(v) && !UTILS.isArr(v));
  },

  isObj(val) {
    if (!UTILS.isArr(val)) {
      return typeof val === 'object';
    }

    return val.every(v => typeof v === 'object');
  },

  isArr(val) {
    return Array.isArray(val);
  },

  isFunc(val) {
    return typeof val === 'function';
  },

  isBool(val) {
    return typeof val === 'boolean';
  },

  isStr(val) {
    return typeof val === 'string';
  },

  throwError(msg) {
    throw new Error(msg);
  },

  hasProperty(children, parent) {
    if (!UTILS.isArr(children)) {
      return children in parent;
    }

    return children.every(child => child in parent);
  },

  handleFunc(func, params) {
    if (UTILS.isFunc(func)) {
      return func(params);
    }
  },

  handleFuncOrBool(val, funcParams = undefined) {
    let res = Boolean(val);

    if (UTILS.isFunc(val)) {
      res = val(funcParams);
    }

    return res;
  },

  debounce(func) {
    let debounce_timeout;
    return (time, data) => {
      clearTimeout(debounce_timeout);
      debounce_timeout = setTimeout(() => {
        clearTimeout(debounce_timeout);
        func(data);
      }, time);
    };
  },

  logger(items, options = {}) {
    const {
      show,
      warn
    } = options;

    if (show) {
      if (warn) {
        console.warn(...items);
        return;
      }

      console.log(...items);
    }
  }

};

const createModel = schema => {
  const models = {};

  (function init(s) {
    if (s === null || s === void 0 ? void 0 : s.model) {
      var _s$model, _s$model2;

      models[UTILS.isArr(s.model) && ((_s$model = s.model) === null || _s$model === void 0 ? void 0 : _s$model[0]) || s.model] = {
        value: '',
        error: ''
      };
      Object.defineProperty(models[UTILS.isArr(s.model) && ((_s$model2 = s.model) === null || _s$model2 === void 0 ? void 0 : _s$model2[0]) || s.model], 'options', {
        value: (s === null || s === void 0 ? void 0 : s.options) || {},
        enumerable: false
      });
    }

    if (s === null || s === void 0 ? void 0 : s.children) {
      s === null || s === void 0 ? void 0 : s.children.forEach(i => init(i));
    }
  })(schema);

  return models;
};

var script = {
  mixins: [props],
  emits: ['input'],

  data() {
    const models = createModel(this.schema);
    return {
      models
    };
  },

  watch: {
    value: {
      handler: 'watchValue',
      deep: true
    },
    models: {
      handler: 'watchModels',
      deep: true,
      immediate: true
    }
  },

  created() {
    Object.keys(this.models).forEach(m => {
      this.$watch(`models.${m}.value`, () => {
        this.validateModel(m);
      }, {
        deep: true
      });
    });
  },

  mounted() {
    var _this$schema, _this$schema$options;

    if (this === null || this === void 0 ? void 0 : (_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$options = _this$schema.options) === null || _this$schema$options === void 0 ? void 0 : _this$schema$options.onLoadValidation) {
      this.validate();
    }
  },

  methods: {
    watchValue(v) {
      for (const m in v) {
        this.models[m].value = v === null || v === void 0 ? void 0 : v[m].value;
        this.models[m].error = v === null || v === void 0 ? void 0 : v[m].error;
      }
    },

    watchModels() {
      this.$emit('input', this.models);
    },

    resetValidation() {
      for (const m in this.models) {
        this.models[m].error = '';
      }
    },

    reset() {
      for (const m in this.models) {
        this.models[m].value = '';
        this.models[m].value = '';
      }
    },

    validErr: v => v && !['boolean'].includes(typeof v) || !v && ['string', 'boolean'].includes(typeof v),

    setError(m, e) {
      this.models[m].error = this.validErr(e) ? e : '';
    },

    runModelRules(val, rules) {
      let err;

      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          err = rule;

          if (UTILS.isFunc(rule)) {
            err = rule(val);
          }

          if (this.validErr(err)) {
            break;
          }
        }
      }

      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }

      return err;
    },

    validateModel(m, validate) {
      var _this$models$m$option, _this$models$m$option2, _this$schema2, _this$schema2$options, _this$schema3, _this$schema3$rules;

      const validationOption = ((_this$models$m$option = this.models[m].options) === null || _this$models$m$option === void 0 ? void 0 : _this$models$m$option.activeValidation) ? (_this$models$m$option2 = this.models[m].options) === null || _this$models$m$option2 === void 0 ? void 0 : _this$models$m$option2.activeValidation : this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$options = _this$schema2.options) === null || _this$schema2$options === void 0 ? void 0 : _this$schema2$options.activeValidation;
      const err = (validate || validationOption) && this.runModelRules(this.models[m].value, this === null || this === void 0 ? void 0 : (_this$schema3 = this.schema) === null || _this$schema3 === void 0 ? void 0 : (_this$schema3$rules = _this$schema3.rules) === null || _this$schema3$rules === void 0 ? void 0 : _this$schema3$rules[m]);
      this.setError(m, err);
    },

    validate() {
      for (const m in this.models) {
        this.validateModel(m, true);
      }
    }

  },

  render(createElement) {
    const {
      tag: rootTag,
      data: rootData,
      children: rootChildren
    } = this.schema;

    const nestDom = arr => {
      if (arr && UTILS.isArr(arr)) {
        return arr.map(({
          tag,
          data,
          children
        }) => createElement(tag, data, nestDom(children)));
      }

      return [];
    };

    return createElement(rootTag, rootData, nestDom(rootChildren));
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */

/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

// Import vue component

const install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__;
