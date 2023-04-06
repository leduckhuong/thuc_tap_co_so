"use strict";
class Validator {
    constructor(_form, _formGroupSelector, _errorSelector, _errorClassCss, _rules) {
        this.form = _form;
        this.formGroupSelector = _formGroupSelector;
        this.errorSelector = _errorSelector;
        this.errorClassCss = _errorClassCss;
        this.rules = _rules;
    }
    // tim kiem Element wraper cuar element input
    getParent(element, selector) {
        while (element.parent()) {
            if (element.parent().is(selector)) {
                return element.parent();
            }
            element = element.parent();
        }
    }
    // ham thuc hien validate
    validate(inputElement, rule) {
        var _a, _b, _c;
        const errorElement = (_a = this.getParent(inputElement, this.formGroupSelector)) === null || _a === void 0 ? void 0 : _a.children(this.errorSelector);
        let errorMessage;
        // lay ra cac rules cua selector
        let rules = Validator.selectorRules[rule.selector];
        //lap qua tung rule va kiem tra
        // neu co loi thi ap dung va dung viec kiem tra
        for (let i = 0; i < rules.length; ++i) {
            switch (inputElement.attr('type')) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i]($(this.form + ' ' + rule.selector + ':checked').val());
                    break;
                default:
                    errorMessage = rules[i](inputElement.val());
            }
            if (errorMessage)
                break;
        }
        if (errorMessage) {
            errorElement === null || errorElement === void 0 ? void 0 : errorElement.text(errorMessage);
            (_b = this.getParent(inputElement, this.formGroupSelector)) === null || _b === void 0 ? void 0 : _b.addClass(this.errorClassCss);
        }
        else {
            errorElement === null || errorElement === void 0 ? void 0 : errorElement.text('');
            (_c = this.getParent(inputElement, this.formGroupSelector)) === null || _c === void 0 ? void 0 : _c.removeClass(this.errorClassCss);
        }
        return !!errorMessage;
    }
    // Lay element cua form can validate va lang nghe su kien
    start() {
        const formElement = $(this.form);
        if (formElement) {
            // su kien submit form
            this.handleListenerSubmitForm(formElement);
            // lap qua rule va lang nghe su kien cua input element
            this.handleListenerInputChange();
        }
    }
    // xy ly su kien submit form
    handleListenerSubmitForm(formElement) {
        formElement.on('submit', (e) => {
            e.preventDefault();
            let isValidSubmit = true;
            // lap qua tung rule va validate
            this.rules.forEach((rule) => {
                let inputElement = $(rule.selector);
                let isValid = this.validate(inputElement, rule);
                if (isValid)
                    isValidSubmit = false;
            });
            if (isValidSubmit) {
                e.target.submit();
            }
            else {
                console.log('isvalid submit');
            }
        });
    }
    // xu ly lap qua rule va lang nghe su kien cua input element
    handleListenerInputChange() {
        this.rules.forEach((rule) => {
            // luu lai cac rule cho moi input
            if (Array.isArray(Validator.selectorRules[rule.selector])) {
                Validator.selectorRules[rule.selector].push(rule.test);
            }
            else {
                Validator.selectorRules[rule.selector] = [rule.test];
            }
            let inputElement = $(rule.selector);
            if (inputElement) {
                // khi roi khoi input
                inputElement.on('blur', () => {
                    this.validate(inputElement, rule);
                });
            }
        });
    }
    static Required(selector, message) {
        return {
            selector,
            test: function (value) {
                return value ? '' : message || 'Vui lòng nhập trường này';
            }
        };
    }
    static Email(selector, message) {
        return {
            selector,
            test: function (value) {
                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return (typeof (value) === 'string' && regex.test(value)) ? '' : message || 'Trường này phải là email!';
            }
        };
    }
    static MinLength(selector, min, message) {
        return {
            selector,
            test: function (value) {
                return (typeof (value) === 'string' && value.length >= min) ? '' : message || `Vui lòng chuỗi ký tư tối thiểu ${min} ký tự!`;
            }
        };
    }
    static Confirmed(selector, getConfirmValue, message) {
        return {
            selector,
            test: function (value) {
                if (value === getConfirmValue())
                    return '';
                else {
                    $(selector).val('');
                    return message || 'Giá trị nhập vào không chính xác!';
                }
            }
        };
    }
}
Validator.selectorRules = {};