import React, { Component } from "react";
import PropTypes from "prop-types";

import Radio from "metabase/components/Radio";
import StackedCheckBox from "metabase/components/StackedCheckBox";
import Toggle from "metabase/components/Toggle";

export default class EmailAttachmentPicker extends Component {
  constructor(props, context) {
    super(props, context);

    this.attachmentTypeValue = this.attachmentTypeValue.bind(this);
    this.setAttachmentType = this.setAttachmentType.bind(this);
    this.toggleAttach = this.toggleAttach.bind(this);
  }

  static propTypes = {
    pulse: PropTypes.object.isRequired,
    setPulse: PropTypes.func.isRequired,
  };

  DEFAULT_ATTACHMENT_TYPE = "csv";

  attachmentTypeValue() {
    const { pulse } = this.props;

    if (pulse.cards.some(c => c.include_xls)) {
      return "xls";
    } else if (pulse.cards.some(c => c.include_csv)) {
      return "csv";
    } else {
      return null;
    }
  }

  setAttachmentType(attachmentType) {
    const { pulse, setPulse } = this.props;

    setPulse({
      ...pulse,
      cards: pulse.cards.map(card => {
        card.include_xls = attachmentType === "xls";
        card.include_csv = attachmentType === "csv";
        return card;
      }),
    });
  }

  toggleAttach(includeAttachment) {
    if (includeAttachment) {
      const existingValue = this.attachmentTypeValue();
      this.setAttachmentType(existingValue || this.DEFAULT_ATTACHMENT_TYPE);
    } else {
      this.setAttachmentType(null);
    }
  }

  render() {
    return (
      <div>
        <Toggle
          value={this.attachmentTypeValue() != null}
          onChange={this.toggleAttach}
        />

        {this.attachmentTypeValue() != null && (
          <div>
            <div className="text-bold py2 flex justify-between align-center">
              <Radio
                options={[
                  { name: "CSV", value: "csv" },
                  { name: "XLSX", value: "xls" },
                ]}
                onChange={this.setAttachmentType}
                value={this.attachmentTypeValue()}
              />
            </div>
            <div className="text-bold py2 flex justify-between align-center">
              <StackedCheckBox
                checked={true}
                indeterminate={false}
                className="mr1"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
