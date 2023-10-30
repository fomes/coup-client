import React, { Component } from "react";
import "./CoupStyles.css";

export default class ActionDecision extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDecisionMade: false,
      decision: "",
      isPickingTarget: false,
      targetAction: "",
      actionError: "",
    };
  }

  chooseAction = (action, target = null) => {
    const res = {
      action: {
        action: action,
        target: target,
        source: this.props.name,
      },
    };
    console.log(res);

    this.props.socket.emit("g-actionDecision", res);
    this.props.doneAction();
  };

  deductCoins = (action) => {
    console.log(this.props.money, action);
    if (action === "assassinate") {
      if (this.props.money >= 3) {
        this.props.deductCoins(3);
        this.pickingTarget("assassinate");
      } else {
        this.setState({ actionError: "Not enough coins to assassinate!" });
      }
    } else if (action === "coup") {
      if (this.props.money >= 7) {
        this.props.deductCoins(7);
        this.pickingTarget("coup");
      } else {
        this.setState({ actionError: "Precisa de 7 moedas!" });
      }
    }
  };

  pickingTarget = (action) => {
    this.setState({
      isPickingTarget: true,
      targetAction: action,
      actionError: "",
    });
    this.setState({ targetAction: action });
  };

  pickTarget = (target) => {
    this.chooseAction(this.state.targetAction, target);
  };

  render() {
    let controls = null;
    if (this.state.isPickingTarget) {
      controls = this.props.players
        .filter((x) => !x.isDead)
        .filter((x) => x.name !== this.props.name)
        .map((x, index) => {
          return (
            <button
              style={{ backgroundColor: x.color }}
              key={index}
              onClick={() => this.pickTarget(x.name)}
            >
              {x.name}
            </button>
          );
        });
    } else if (this.props.money < 10) {
      controls = (
        <div>
          <button onClick={() => this.chooseAction("income")}>
            <span>Qualquer:</span>
            <span>Renda</span>
          </button>
          <button onClick={() => this.deductCoins("coup")}>
            {" "}
            <span>Qualquer:</span>
            <span>Golpe</span>
          </button>
          <button onClick={() => this.chooseAction("foreign_aid")}>
            <span>Qualquer:</span>
            <span>Ajuda Externa</span>
          </button>
          <button id="captain" onClick={() => this.pickingTarget("steal")}>
            <span>Capitão:</span>
            <span>Roubar</span>
          </button>
          <button id="assassin" onClick={() => this.deductCoins("assassinate")}>
            <span>Assassino:</span>
            <span>Assassinar</span>
          </button>
          <button id="duke" onClick={() => this.chooseAction("tax")}>
            <span>Duque:</span>
            <span>Taxar</span>
          </button>
          <button id="ambassador" onClick={() => this.chooseAction("exchange")}>
            <span>Embaixador:</span>
            <span>Trocar</span>
          </button>
        </div>
      );
    } else {
      //money over 10, has to coup
      controls = (
        <button onClick={() => this.deductCoins("coup")}>Golpe</button>
      );
    }

    return (
      <>
        <p className="DecisionTitle">Escolha uma ação:</p>
        <div className="DecisionButtonsContainer">
          {controls}
          <p>{this.state.actionError}</p>
        </div>
      </>
    );
  }
}
