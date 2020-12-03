import React, { Component } from "react";
import PropTypes from "prop-types";

import CheckBox from "metabase/components/CheckBox";
import Radio from "metabase/components/Radio";
import StackedCheckBox from "metabase/components/StackedCheckBox";
import Toggle from "metabase/components/Toggle";

export default class EmailAttachmentPicker extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { selectedCards: this.cardIds() };
  }

  state = {
    selectedCards: new Set(),
  };

  static propTypes = {
    pulse: PropTypes.object.isRequired,
    setPulse: PropTypes.func.isRequired,
  };

  DEFAULT_ATTACHMENT_TYPE = "csv";

  cardIds = () => {
    return new Set(this.props.cards.map(card => card.id));
  };

  attachmentTypeValue = () => {
    const { pulse } = this.props;

    if (pulse.cards.some(c => c.include_xls)) {
      return "xls";
    } else if (pulse.cards.some(c => c.include_csv)) {
      return "csv";
    } else {
      return null;
    }
  };

  setAttachmentType = attachmentType => {
    const { pulse, setPulse } = this.props;

    setPulse({
      ...pulse,
      cards: pulse.cards.map(card => {
        card.include_xls = attachmentType === "xls";
        card.include_csv = attachmentType === "csv";
        return card;
      }),
    });
  };

  toggleAttach = includeAttachment => {
    if (includeAttachment) {
      const existingValue = this.attachmentTypeValue();
      this.setAttachmentType(existingValue || this.DEFAULT_ATTACHMENT_TYPE);
    } else {
      this.setAttachmentType(null);
    }
  };

  areAllSelected = (allCards, selectedCardSet) => {
    return allCards.length === selectedCardSet.size;
  };

  areOnlySomeSelected = (allCards, selectedCardSet) => {
    return 0 < selectedCardSet.size && selectedCardSet.size < allCards.length;
  };

  onToggleCard = card => {
    this.setState(({ selectedCards }) => {
      const id = card.id;
      if (selectedCards.has(id)) {
        selectedCards.delete(id);
      } else {
        selectedCards.add(id);
      }

      return { selectedCards };
    });
  };

  onToggleAll = () => {
    const { cards } = this.props;
    this.setState(({ selectedCards }) => {
      if (this.areAllSelected(cards, selectedCards)) {
        return { selectedCards: new Set() };
      } else {
        return { selectedCards: this.cardIds() };
      }
    });
  };

  render() {
    const { cards } = this.props;
    const { selectedCards } = this.state;

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
              <ul className="pt1">
                <li
                  className="px1 pb1 flex align-center cursor-pointer border-bottom mb1"
                  onClick={this.onToggleAll}
                >
                  <StackedCheckBox
                    checked={this.areAllSelected(cards, selectedCards)}
                    indeterminate={this.areOnlySomeSelected(
                      cards,
                      selectedCards,
                    )}
                    className="mr1"
                  />
                </li>
                {cards.map(card => (
                  <li
                    key={card.id}
                    className="px1 pb1 flex align-center cursor-pointer"
                    onClick={() => {
                      this.onToggleCard(card);
                    }}
                  >
                    <CheckBox
                      checked={selectedCards.has(card.id)}
                      className="mr1"
                    />
                    {card.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}
