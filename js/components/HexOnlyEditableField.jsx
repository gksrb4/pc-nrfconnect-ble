/* Copyright (c) 2015 Nordic Semiconductor. All Rights Reserved.
 *
 * The information contained herein is property of Nordic Semiconductor ASA.
 * Terms and conditions of usage are described in detail in NORDIC
 * SEMICONDUCTOR STANDARD SOFTWARE LICENSE AGREEMENT.
 *
 * Licensees are granted free, non-transferable use of the information. NO
 * WARRANTY of ANY KIND is provided. This heading must NOT be removed from
 * the file.
 *
 */

'use strict';

import EditableField from './EditableField.jsx';

let HexOnlyEditableField = React.createClass({
    /*
        Produces some text that changes into a textarea when clicked (like EditableField).
        The textarea only accepts hexadecimal characters.
        The input is automatically formatted into pairs of characters (bytes), like so: AB-D2-C1.

        Usage:
        <HexOnlyEditableField value={value} />

        Where _value_ is the text that should turn editable.
        It also accepts all props that EditableField accepts, except
        keyPressValidation, completeValidation, onBackspace and formatInput

        This component wraps EditableField, so see that component for info on how the dataflow etc works.

        There's a lot of complexity here related to keeping the caret in the right position.
    */
    _hexRegEx: /^[0-9a-f\-]*$/i,
    _keyPressValidation(str) {
        return this._hexRegEx.test(str);
    },
    _formatInput(str, caretPosition) {
        caretPosition = this._calcCaretPosition(str, caretPosition);
        let chars = str.toUpperCase().replace(/-/g, "").split("");
        //insert dashes after every second char
        let inserted = 0;
        const originalLength = chars.length;

        for (let i = 2; i < originalLength; i += 2) {
            chars.splice(i+inserted, 0, "-");
            inserted += 1;
        }

        return {
            value: chars.join(""),
            caretPosition: caretPosition
        }
    },
    _onBeforeBackspace(e) {
        //when backspace will remove a dash, also remove the character before the dash
        let str = e.target.value;
        const caret = e.target.selectionStart;
        if (str.substr(caret-1, 1) === "-") {
            //remove the dash - this sets the caret at end of the text
            e.target.value = str.slice(0, caret-1) + str.slice(caret, str.length);
            //reset the caret back to before the dash, so the backspace event itself will remove the char before the dash
            e.target.setSelectionRange(caret-1, caret-1);
        }
    },
    _calcCaretPosition(origValue, caretPosition) {
        /*
        * Replacing the textarea contents places the caret at the end.
        * We need to place the caret back where it should be.
        * Since we're adding dashes, this is not so trivial.
        *
        * Consider if the user typed the 1 in the string below:
        * Before formatting: AA-A1A-AA, After: AA-A1-AA-A
        * caretPosition before: 5, caretPosition after: 5
        *
        * But here it works differently:
        * Before formatting: AA-AA1-AA, After: AA-AA-1A-A
        * caretPosition before: 6, caretPosition after: 7
        *
        * And there's also this case:
        * Before formatting: AA-AA-1AA, After: AA-AA-1A-A
        * caretPosition before: 7, caretPosition after: 7
        *
        * Also have to handle backspace:
        * Before formatting: AA-A-AA, After: AA-AA-A
        * caretPosition before: 4, caretPosition after: 4
        *
        * Find where the caret would be without the dashes,
        * and map that position back to the dashed string
        */
        const dashesBeforeCaret = origValue.substr(0, caretPosition).match(/-/g)
        const numDashesBeforeCaret = dashesBeforeCaret === null ? 0 : dashesBeforeCaret.length
        const caretPositionWithoutDashes = caretPosition - numDashesBeforeCaret;
        const correctNumberOfDashes = Math.floor(caretPositionWithoutDashes/2);
        caretPosition = caretPositionWithoutDashes + correctNumberOfDashes;
        return caretPosition;
    },
    _onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    },
    _completeValidation(str) {
        let isFullbytes = str.replace(/-/g, "").length % 2 === 0;
        if (!isFullbytes) {
            this.refs.editableField.setState({validationMessage: "Please enter full bytes (pairs of hexadecimals)"});
        }
        return isFullbytes;
    },
    _getValueArray(value) {
        if (!this._completeValidation(value)) {
            return;
        }

        let valueArray = [];

        for (let i = 0; i < value.length; i += 3) {
            let slice = value.substring(i, i+2);
            let parsedInt = parseInt(slice, 16);
            valueArray.push(parsedInt);
        }

        return valueArray;
    },
    render() {
        const {keyPressValidation, completeValidation, onBackspace, formatInput, onChange, ...props} = this.props; //pass along all props except these
        return <EditableField {...props}
                    keyPressValidation={this._keyPressValidation} completeValidation={this._completeValidation}
                    onBeforeBackspace={this._onBeforeBackspace} formatInput={this._formatInput} onChange={this._onChange} getValueArray={this._getValueArray} ref="editableField" />;
    }
});


module.exports = HexOnlyEditableField;