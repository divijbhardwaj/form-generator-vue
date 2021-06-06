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

/* template */
var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, {}, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var props = {
  props: {
    value: {
      type: Object,
      default: null,
      required: false
    },
    submit: {
      type: Function,
      required: false,
      default: undefined
    },
    components: {
      type: Array,
      required: false,
      default: () => []
    },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    schema: {
      type: Object,
      default: () => ({})
    },
    // classes: {
    //   type: Object,
    //   required: false,
    //   default: () => ({}),
    // },
    submitFail: {
      type: Function,
      required: false,
      default: undefined
    },
    activeValidation: {
      type: Boolean,
      required: false,
      default: true
    },
    // activeValidationDelay: {
    //   type: Number,
    //   required: false,
    //   default: 0
    // },
    logs: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};

const UTILS = {
  isUndef(val) {
    return typeof val === 'undefined';
  },

  isObjNotArr(val) {
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

const ERROR_TYPES = ['string', 'object'];
const CLASS = {
  form: 'fgv-form',
  // header: 'fgv-header',
  body: 'fgv-body',
  // footer: 'fgv-footer',
  row: 'fgv-row',
  rowContainer: 'fgv-row-container',
  colContainer: 'fgv-col-container',
  col: 'fgv-col'
};
const SLOT = {
  header: 'header',
  footer: 'footer',
  beforeComponent: v => `before-${v}`,
  afterComponent: v => `after-${v}`,
  beforeRow: 'before-row',
  rowStart: 'row-start',
  rowEnd: 'row-end',
  afterRow: 'after-row',
  beforeCol: 'before-col',
  afterCol: 'after-col'
};
const SCHEMA = {
  fields: 'fields',
  av: 'activeValidation',
  avDelay: 'activeValidationDelay',
  logs: 'logs'
};
const VMODEL = {
  fields: 'fields',
  errors: 'errors'
};
const FIELD = {
  av: SCHEMA.av,
  avDelay: SCHEMA.avDelay,
  vOn: 'vOn',
  component: 'component',
  type: {
    text: 'text',
    number: 'number'
  },
  props: {
    required: 'required',
    disabled: 'disabled',
    hidden: 'hidden'
  },
  rules: 'rules'
};

//
var script = {
  components: {
    Body: __vue_component__,
    RowContainer: __vue_component__,
    Row: __vue_component__,
    ColumnContainer: __vue_component__,
    Column: __vue_component__
  },
  mixins: [props],
  emits: ['input'],

  data() {
    var _this$value;

    const form = (_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.form;
    const fields = {};
    const errors = {};

    const addFieldsAndErrors = model => {
      var _this$value2, _this$value2$VMODEL$f, _this$value3, _this$value3$VMODEL$e;

      fields[model] = ((_this$value2 = this.value) === null || _this$value2 === void 0 ? void 0 : (_this$value2$VMODEL$f = _this$value2[VMODEL.fields]) === null || _this$value2$VMODEL$f === void 0 ? void 0 : _this$value2$VMODEL$f[model]) || '';
      errors[model] = ((_this$value3 = this.value) === null || _this$value3 === void 0 ? void 0 : (_this$value3$VMODEL$e = _this$value3[VMODEL.errors]) === null || _this$value3$VMODEL$e === void 0 ? void 0 : _this$value3$VMODEL$e[model]) || '';
    };

    for (const fieldConf of this.schema[SCHEMA.fields]) {
      if (UTILS.isArr(fieldConf)) {
        for (const subFieldConf of fieldConf) {
          addFieldsAndErrors(subFieldConf.model);
        }
      } else {
        addFieldsAndErrors(fieldConf.model);
      }
    }

    return {
      form,
      fields,
      errors,
      submitClick: false
    };
  },

  computed: {
    SLOT: () => SLOT,
    CLASS: () => CLASS,
    UTILS: () => UTILS,

    // globalAv() {
    //   return this.activeValidation || false;
    // },
    // globalAvDelay() {
    //   return this.activeValidationDelay || 0;
    // },
    // allFieldsArray() {
    //   return UTILS.isArr(this.schema?.[SCHEMA.fields])
    //     ? this.schema[SCHEMA.fields]
    //     : [];
    // },
    fieldsFlat() {
      const flat = {};

      for (const conf of this.schema[SCHEMA.fields]) {
        if (UTILS.isArr(conf)) {
          for (const subConf of conf) {
            flat[subConf.model] = subConf;
          }
        } else {
          flat[conf.model] = conf;
        }
      }

      return flat;
    } // debounceValidateField() {
    //   return UTILS.debounce((model) => {
    //     this.validateField(model);
    //   });
    // },


  },
  watch: {
    // disabled: {
    //   handler() {
    //     this.removeAllErrors();
    //   },
    // },
    value: {
      handler() {
        for (const model in (_this$value4 = this.value) === null || _this$value4 === void 0 ? void 0 : _this$value4[VMODEL.fields]) {
          var _this$value4, _this$value5, _this$value5$VMODEL$f, _this$value6, _this$value6$VMODEL$e;

          this.fields[model] = (_this$value5 = this.value) === null || _this$value5 === void 0 ? void 0 : (_this$value5$VMODEL$f = _this$value5[VMODEL.fields]) === null || _this$value5$VMODEL$f === void 0 ? void 0 : _this$value5$VMODEL$f[model];
          this.errors[model] = (_this$value6 = this.value) === null || _this$value6 === void 0 ? void 0 : (_this$value6$VMODEL$e = _this$value6[VMODEL.errors]) === null || _this$value6$VMODEL$e === void 0 ? void 0 : _this$value6$VMODEL$e[model];
        }
      },

      deep: true
    },
    form: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
    fields: {
      handler: 'emitData',
      deep: true,
      immediate: true
    },
    errors: {
      handler: 'emitData',
      deep: true,
      immediate: true
    }
  },

  created() {
    // fields watcher
    for (const model in this.fields) {
      const conf = this.getFieldConf(model);
      this.$watch(`fields.${model}`, (newVal, oldVal) => {
        this.typeCoercion(conf); // when only data type is changed.

        if (newVal == oldVal && typeof newVal !== typeof oldVal) {
          return;
        } // this.validate(fieldConf, true);


        this.validateField(conf);
      }, {
        deep: true
      });
    } // Object.keys(this.fields).forEach((model) => {
    //   const fieldConf = this.getFieldConf(model);
    //   this.$watch(`fields.${model}`, (newVal, oldVal) => {
    //     this.typeCoercion(fieldConf);
    //     // when only data type is changed.
    //     if (newVal == oldVal && typeof newVal !== typeof oldVal) {
    //       return;
    //     }
    //     // this.validate(fieldConf, true);
    //     this.validateField(fieldConf);
    //   }, { deep: true });
    // });

  },

  methods: {
    emitData() {
      this.$emit('input', {
        form: this.form,
        [VMODEL.fields]: this.fields,
        [VMODEL.errors]: this.errors
      });
    },

    resetForm() {
      this.submitClick = false;
    },

    showRow(conf) {
      return UTILS.isArr(conf) ? conf.length && conf.some(c => this.showCol(c)) : this.showCol(conf);
    },

    showCol(conf) {
      return this.componentName(conf) && !this.fieldHidden(conf);
    },

    slotProps(conf) {
      if (UTILS.isArr(conf)) {
        return conf.map(({
          model
        }) => model);
      }

      return [conf.model];
    },

    componentProps(conf, options = {}) {
      var _this$schema, _this$schema$form, _this$schema$form$pro;

      const {
        form,
        field
      } = options; // const cName = this.componentName(conf);

      const componentData = this.componentData(this.componentName(conf)); // const errorPropName = fieldConf?.errorProp || componentData?.errorProp || 'errorMessages';
      // const errorPropName = componentData?.errorProp;

      const p = { ...(conf === null || conf === void 0 ? void 0 : conf.props),
        disabled: ((_this$schema = this.schema) === null || _this$schema === void 0 ? void 0 : (_this$schema$form = _this$schema.form) === null || _this$schema$form === void 0 ? void 0 : (_this$schema$form$pro = _this$schema$form.props) === null || _this$schema$form$pro === void 0 ? void 0 : _this$schema$form$pro.disabled) || (conf === null || conf === void 0 ? void 0 : conf.disabled)
      };

      if (form) {
        var _conf$props;

        p.is = (conf === null || conf === void 0 ? void 0 : (_conf$props = conf.props) === null || _conf$props === void 0 ? void 0 : _conf$props.is) || 'form';
      }

      if (field) {
        var _conf$props2;

        if (componentData === null || componentData === void 0 ? void 0 : componentData.errorProp) {
          p[componentData.errorProp] = this.errors[conf.model];
        }

        p.type = (conf === null || conf === void 0 ? void 0 : (_conf$props2 = conf.props) === null || _conf$props2 === void 0 ? void 0 : _conf$props2.type) || FIELD.type.text;
      }

      return p;
    },

    // removeAllErrors() {
    //   for (const model in this.errors) {
    //     this.errors[model] = '';
    //   }
    // },
    setError(model, err) {
      // if ((UTILS.isBool(err) && err) || (!UTILS.isBool(err) && !err)) {
      //   this.errors[model] = noErr;
      //   return;
      // }
      // prop is not rmoved from errors if set undefined
      this.errors[model] = ERROR_TYPES.includes(typeof err) ? err : '';
    },

    componentData(name) {
      return this.components.find(c => (c === null || c === void 0 ? void 0 : c.name) === name);
    },

    typeCoercion(conf) {
      var _conf$props3;

      if (this.fields[conf.model] && (conf === null || conf === void 0 ? void 0 : (_conf$props3 = conf.props) === null || _conf$props3 === void 0 ? void 0 : _conf$props3.type) === FIELD.type.number) {
        if (!Number.isNaN(this.fields[conf.model])) {
          return;
        }

        this.fields[conf.model] = Number(this.fields[conf.model]);
      } // if (!Number.isNaN(Number(this.fields[fieldConf.model]))) {
      //   return;
      // }
      // if (fieldConf?.vBind?.type === FIELD.type.number && this.fields[fieldConf.model]) {
      //   this.fields[fieldConf.model] = Number(this.fields[fieldConf.model]);
      // }

    },

    componentEvents(conf, options = {}) {
      const {
        form
      } = options;
      const e = (conf === null || conf === void 0 ? void 0 : conf[FIELD.vOn]) || {};

      if (form) {
        var _conf$vOn;

        e.submit = (conf === null || conf === void 0 ? void 0 : (_conf$vOn = conf.vOn) === null || _conf$vOn === void 0 ? void 0 : _conf$vOn.submit) || this.submit && this.handleSubmit || (ev => {
          ev === null || ev === void 0 ? void 0 : ev.preventDefault();
          UTILS.logger(['submit handler not present.\n'], {
            warn: true,
            show: this.logs
          });
        });
      }

      return e;
    },

    componentName(conf) {
      var _conf$props4;

      if (conf === null || conf === void 0 ? void 0 : (_conf$props4 = conf.props) === null || _conf$props4 === void 0 ? void 0 : _conf$props4.is) {
        var _conf$props5;

        return conf === null || conf === void 0 ? void 0 : (_conf$props5 = conf.props) === null || _conf$props5 === void 0 ? void 0 : _conf$props5.is;
      }

      const cData = this.components.find(({
        types
      }) => {
        var _conf$props6;

        return types.includes(conf === null || conf === void 0 ? void 0 : (_conf$props6 = conf.props) === null || _conf$props6 === void 0 ? void 0 : _conf$props6.type);
      });
      return cData === null || cData === void 0 ? void 0 : cData.name;
    },

    getFieldConf(model) {
      return this.fieldsFlat[model];
    },

    // fieldDisabled(fieldConf) {
    //   const DISABLED = true;
    //   const fieldDisabled = fieldConf?.vBind
    //    && FIELD.vBind.disabled in fieldConf.vBind
    //     ? fieldConf.vBind?.[FIELD.vBind.disabled]
    //     : !DISABLED;
    //   return this.disabled || fieldDisabled;
    // },
    // fieldRequired(fieldConf) {
    //   const REQUIRED = true;
    //   return fieldConf?.vBind && FIELD.vBind.required in fieldConf.vBind
    //     ? Boolean(fieldConf?.vBind?.[FIELD.vBind.required]) : !REQUIRED;
    // },
    fieldHidden(conf) {
      var _conf$props7;

      const HIDDEN = true;
      return (conf === null || conf === void 0 ? void 0 : conf.props) && FIELD.props.hidden in conf.props ? Boolean((_conf$props7 = conf.props) === null || _conf$props7 === void 0 ? void 0 : _conf$props7[FIELD.props.hidden]) : !HIDDEN;
    },

    runFieldRules(val, rules) {
      let err;

      if (UTILS.isArr(rules)) {
        for (const rule of rules) {
          // valid return values: string
          err = rule;

          if (UTILS.isFunc(rule)) {
            err = rule(val);
          }

          if (ERROR_TYPES.includes(typeof err)) {
            break;
          }
        }
      }

      if (UTILS.isFunc(rules)) {
        err = rules(val);
      }

      return err;
    },

    validateField(conf) {
      var _this$schema2, _this$schema2$rules;

      // const fieldRequired = this.fieldRequired(fieldConf);
      const av = FIELD.av in conf ? conf === null || conf === void 0 ? void 0 : conf[FIELD.av] : this.activeValidation;
      const err = (this.submitClick || av) && this.runFieldRules(this.fields[conf.model], this === null || this === void 0 ? void 0 : (_this$schema2 = this.schema) === null || _this$schema2 === void 0 ? void 0 : (_this$schema2$rules = _this$schema2.rules) === null || _this$schema2$rules === void 0 ? void 0 : _this$schema2$rules[conf.model]); // if (!fieldRequired) {
      //   if (!this.submit) this.setError(fieldConf.model, err, NO_ERR);
      // } else this.setError(fieldConf.model, err, NO_ERR);

      this.setError(conf.model, err); // return err;
    },

    validateForm() {
      // watcher handler
      // if (fieldConf && isWatcher) {
      // const fieldAv = fieldConf[FIELD.av] || this.globalAv;
      // const fieldAvDelay = fieldConf[FIELD.avDelay] || this.globalAvDelay;
      // if (fieldAv && fieldAvDelay) {
      //   this.debounceValidateField(fieldAvDelay)(fieldConf);
      // } else this.validateField(fieldConf);
      // this.validateField(fieldConf);
      // return;
      // }
      // watcher handler end
      // On form submit
      // const fieldsStatus = {};
      // Object.values(this.fieldsFlat).forEach((conf) => {
      //   const err = this.validateField(conf);
      //   fieldsStatus[conf.model] = {
      //     // validationSuccess: !err ? true : !this.fieldRequired(conf),
      //     validationSuccess: !err,
      //     schema: conf
      //   };
      // });
      const fieldsStatus = {};

      for (const model in this.fields) {
        const conf = this.fieldsFlat[model];
        this.validateField(conf);
        fieldsStatus[conf.model] = {
          validationSuccess: !this.errors[model],
          hidden: this.fieldHidden(conf),
          schema: conf
        };
      }

      const submitFail = Object.keys(fieldsStatus).find(model => !fieldsStatus[model].validationSuccess && !fieldsStatus[model].hidden);
      return {
        fieldsStatus,
        submitFail
      };
    },

    async handleSubmit(e) {
      e === null || e === void 0 ? void 0 : e.preventDefault();
      this.submitClick = true;
      const {
        fieldsStatus,
        submitFail
      } = this.validateForm();
      UTILS.logger([`[SUBMIT ${submitFail ? 'FAIL' : 'SUCCESS'}]`, fieldsStatus], {
        show: this.logs
      });

      if (submitFail) {
        if (this.submitFail) {
          await this.submitFail();
        }

        this.resetForm();
        return;
      }

      await this.submit();
      this.resetForm();
    }

  }
};

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.componentName(_vm.schema.form), _vm._g(_vm._b({
    tag: "component",
    class: [_vm.CLASS.form],
    model: {
      value: _vm.form,
      callback: function ($$v) {
        _vm.form = $$v;
      },
      expression: "form"
    }
  }, 'component', _vm.componentProps(_vm.schema.form, {
    form: true
  }), false), _vm.componentEvents(_vm.schema.form, {
    form: true
  })), [_vm._t(_vm.SLOT.header), _vm._v(" "), _c('Body', {
    class: [_vm.CLASS.body]
  }, [_vm._l(_vm.schema.fields, function (conf, i) {
    return [_vm.showRow(conf) ? _c('RowContainer', {
      key: i,
      class: [_vm.CLASS.rowContainer, _vm.CLASS.rowContainer + "-" + (i + 1)]
    }, [_vm._t(_vm.SLOT.beforeRow, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Row', {
      class: [_vm.CLASS.row, _vm.CLASS.row + "-" + (i + 1)]
    }, [_vm._t(_vm.SLOT.rowStart, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), !_vm.UTILS.isArr(conf) ? [_vm.showCol(conf) ? _c('ColumnContainer', {
      key: conf.model,
      class: [_vm.CLASS.colContainer, conf.model]
    }, [_vm._t(_vm.SLOT.beforeCol, null, {
      "models": _vm.slotProps(conf)
    }), _vm._v(" "), _c('Column', {
      class: [_vm.CLASS.col, conf.model]
    }, [_vm._t(_vm.SLOT.beforeComponent(conf.model)), _vm._v(" "), _c(_vm.componentName(conf), _vm._g(_vm._b({
      tag: "component",
      model: {
        value: _vm.fields[conf.model],
        callback: function ($$v) {
          _vm.$set(_vm.fields, conf.model, $$v);
        },
        expression: "fields[conf.model]"
      }
    }, 'component', _vm.componentProps(conf, {
      field: true
    }), false), _vm.componentEvents(conf)), [_vm._t(conf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(conf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()] : _vm._l(conf, function (subConf) {
      return [_vm.showCol(subConf) ? _c('ColumnContainer', {
        key: subConf.model,
        class: [_vm.CLASS.colContainer, subConf.model]
      }, [_vm._t(_vm.SLOT.beforeCol, null, {
        "models": _vm.slotProps(subConf)
      }), _vm._v(" "), _c('Column', {
        class: [_vm.CLASS.col, subConf.model]
      }, [_vm._t(_vm.SLOT.beforeComponent(subConf.model)), _vm._v(" "), _c(_vm.componentName(subConf), _vm._g(_vm._b({
        tag: "component",
        model: {
          value: _vm.fields[subConf.model],
          callback: function ($$v) {
            _vm.$set(_vm.fields, subConf.model, $$v);
          },
          expression: "fields[subConf.model]"
        }
      }, 'component', _vm.componentProps(subConf, {
        field: true
      }), false), _vm.componentEvents(subConf)), [_vm._t(subConf.model)], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterComponent(subConf.model))], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterCol, null, {
        "models": _vm.slotProps(subConf)
      })], 2) : _vm._e()];
    }), _vm._v(" "), _vm._t(_vm.SLOT.rowEnd, null, {
      "models": _vm.slotProps(conf)
    })], 2), _vm._v(" "), _vm._t(_vm.SLOT.afterRow, null, {
      "models": _vm.slotProps(conf)
    })], 2) : _vm._e()];
  })], 2), _vm._v(" "), _vm._t(_vm.SLOT.footer)], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

// Import vue component

const install = function installFormGeneratorVue(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('FormGeneratorVue', __vue_component__$1);
}; // Create module definition for Vue.use()
// to be registered via Vue.use() as well as Vue.component()


__vue_component__$1.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default __vue_component__$1;
