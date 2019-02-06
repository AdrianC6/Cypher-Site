import React from "react";
import "./Cypher.css";

function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
}
export function CypherDisplay(props) {
  if (!props.data) throw new Error("props must contain data object");
  const cypher = props.data;
  return (
    <div className="cypher">
      <h2>{cypher.name}</h2>
      <p>Key: {capitalizeString(cypher.keyType)}</p>
      <p>{cypher.description}</p>
    </div>
  );
}
const defaultEncryptMessage = "type the message you would like to hide.";
const defaultDecryptMessage =
  "type in junk to see the message that might be hidden inside.";

function InputArea(props) {
  return (
    <div className="text-input">
      <h2>{props.title}</h2>
      <textarea
        placeholder={props.defaultText}
        disabled={props.isLoading}
        onChange={props.onChange}
        value={props.value}
      />
      <button disabled={props.isLoading} onClick={props.onClick}>
        {props.buttonText}
      </button>
      <h2>Output</h2>
      <p>{props.outputText}</p>
    </div>
  );
}

export class CypherPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encryptMessage: "",
      decryptMessage: "",
      decryptOutput: "",
      encryptOutput: "",
      displayMode: "decrypt",
      key: "",
      isLoading: false
    };
    this.cypher = props.data;
  }

  keyChanged = e => {
    this.setState({ key: e.target.value });
  };

  decryptChanged = e => {
    this.setState({
      decryptMessage: e.target.value
    });
  };

  encryptChanged = e => {
    this.setState({
      encryptMessage: e.target.value
    });
  };

  renderKey() {
    if (this.cypher.keyType !== "none") {
      return (
        <div>
          <h2>The Key Must Be A {this.cypher.keyType}</h2>
          <input
            value={this.state.key}
            onChange={this.keyChanged}
            type={this.cypher.keyType}
            name="key"
          />
        </div>
      );
    }
  }
  selectionChanged = e => {
    this.setState({ displayMode: e.target.value });
  };
  generateCallback(propFunction, message, destination) {
    return async () => {
      try {
        this.setState({ isLoading: true });
        let altered_message = await this.props[propFunction](
          this.state[message],
          this.state.key
        );
        let obj = {};
        obj[destination] = altered_message;
        this.setState(Object.assign(obj, { isLoading: false }));
      } catch (e) {
        alert(e);
      }
    };
  }
  renderEncryptOrDecrypt() {
    let configuration = {
      defaultText: defaultDecryptMessage,
      title: "Decryption",
      isLoading: this.state.isLoading,
      onChange: this.decryptChanged,
      value: this.state.decryptMessage,
      buttonText: "Decrypt Text",
      onClick: this.generateCallback(
        "onDecrypt",
        "decryptMessage",
        "decryptOutput"
      ),
      outputText: this.state.decryptOutput
    };
    if (this.state.displayMode === "encrypt") {
      configuration = Object.assign(configuration, {
        title: "Encryption",
        defaultText: defaultEncryptMessage,
        onChange: this.encryptChanged,
        value: this.state.encryptMessage,
        buttonText: "Encrypt Text",
        onClick: this.generateCallback(
          "onEncrypt",
          "encryptMessage",
          "encryptOutput"
        ),
        outputText: this.state.encryptOutput
      });
    }
    return <InputArea {...configuration} />;
  }
  render() {
    const cypher = this.props.data;
    return (
      <div>
        {this.renderKey()}
        <h2>{cypher.name}</h2>
        <p>{cypher.description}</p>
        <p>{cypher.example}</p>
        <h3>Select Current Mode</h3>
        <select value={this.state.displayMode} onChange={this.selectionChanged}>
          <option
            value="encrypt"
            selected={this.state.displayMode === "encrypt"}
          >
            Encrypt
          </option>
          <option
            value="decrypt"
            selected={this.state.displayMode === "decrypt"}
          >
            Decrypt
          </option>
        </select>
        <div className="flex stuff">{this.renderEncryptOrDecrypt()}</div>
      </div>
    );
  }
}
