var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// API user: 349

var checkStatus = function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  throw new Error('Request failed. Either 404 or 500.');
};

var json = function json(response) {
  return response.json();
};

var Task = function (_React$Component) {
  _inherits(Task, _React$Component);

  function Task() {
    _classCallCheck(this, Task);

    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  _createClass(Task, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          task = _props.task,
          onDelete = _props.onDelete,
          onComplete = _props.onComplete;
      var id = task.id,
          content = task.content,
          completed = task.completed;

      return React.createElement(
        "tr",
        { className: completed.toString() },
        React.createElement(
          "td",
          null,
          React.createElement("input", { type: "checkbox", onChange: function onChange() {
              return onComplete(id, completed);
            }, checked: completed })
        ),
        React.createElement(
          "td",
          { className: "task-content" },
          content
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "button",
            { className: "btn btn-light btn-sm delete", onClick: function onClick() {
                return onDelete(id);
              } },
            "Delete"
          )
        )
      );
    }
  }]);

  return Task;
}(React.Component);

var ToDoList = function (_React$Component2) {
  _inherits(ToDoList, _React$Component2);

  function ToDoList(props) {
    _classCallCheck(this, ToDoList);

    var _this2 = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

    _this2.state = {
      new_task: '',
      tasks: [],
      filter: 'all',
      active: 'all'
    };
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
    _this2.fetchTasks = _this2.fetchTasks.bind(_this2);
    _this2.deleteTask = _this2.deleteTask.bind(_this2);
    _this2.toggleComplete = _this2.toggleComplete.bind(_this2);
    _this2.toggleFilter = _this2.toggleFilter.bind(_this2);
    return _this2;
  }

  _createClass(ToDoList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTasks();
    }
  }, {
    key: "toggleFilter",
    value: function toggleFilter(e) {
      this.setState({
        active: e.target.name,
        filter: e.target.name
      });
      console.log(this.state);
      console.log(this.state.active);
    }
  }, {
    key: "toggleComplete",
    value: function toggleComplete(id, completed) {
      var _this3 = this;

      if (!id) {
        return;
      }
      var newState = completed ? 'active' : 'complete';
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "/mark_" + newState + "?api_key=349", {
        method: "PUT",
        mode: "cors"
      }).then(checkStatus).then(json).then(function (data) {
        _this3.fetchTasks();
      }).catch(function (error) {
        _this3.setState({ error: error.message });
        console.log(error);
      });
    }
  }, {
    key: "deleteTask",
    value: function deleteTask(id) {
      var _this4 = this;

      if (!id) {
        return;
      }
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "?api_key=349", {
        method: "DELETE",
        mode: "cors"
      }).then(checkStatus).then(json).then(function (data) {
        _this4.fetchTasks();
      }).catch(function (error) {
        _this4.setState({ error: error.message });
      });
    }
  }, {
    key: "fetchTasks",
    value: function fetchTasks() {
      var _this5 = this;

      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=349").then(checkStatus).then(json).then(function (response) {
        console.log(response);
        _this5.setState({ tasks: response.tasks });
      }).catch(function (error) {
        console.error(error.message);
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({ new_task: event.target.value });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      var _this6 = this;

      event.preventDefault();
      var new_task = this.state.new_task;

      new_task = new_task.trim();
      if (!new_task) {
        return;
      }
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=349", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            content: new_task
          }
        })
      }).then(checkStatus).then(json).then(function (data) {
        _this6.setState({ new_task: '' });
        _this6.fetchTasks();
      }).catch(function (error) {
        _this6.setState({ error: error.essage });
        console.log(error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _state = this.state,
          new_task = _state.new_task,
          tasks = _state.tasks,
          filter = _state.filter,
          active = _state.active,
          buttons = _state.buttons;

      console.log("look here:", this.state);
      return React.createElement(
        "div",
        null,
        React.createElement("div", { className: "spacer0" }),
        React.createElement(
          "div",
          { className: "d-flex justify-content-center" },
          React.createElement(
            "div",
            { className: "framer" },
            React.createElement(
              "table",
              { className: "table table-responsive" },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  { className: "table-secondary" },
                  React.createElement("th", { width: "52px", className: "title-task", scope: "col" }),
                  React.createElement(
                    "th",
                    { width: "400px", className: "title-check", scope: "col" },
                    "To-do List"
                  ),
                  React.createElement("th", { width: "82px", className: "title-button", scope: "col" })
                )
              ),
              React.createElement(
                "tbody",
                null,
                tasks.length > 0 ? tasks.filter(function (task) {
                  if (filter === 'all') {
                    return true;
                  } else if (filter === 'active') {
                    return !task.completed;
                  } else {
                    return task.completed;
                  }
                }).map(function (task) {
                  return React.createElement(Task, { key: task.id, task: task, onDelete: _this7.deleteTask, onComplete: _this7.toggleComplete });
                }) : React.createElement(
                  "tr",
                  null,
                  React.createElement("td", null),
                  React.createElement(
                    "td",
                    null,
                    "No content to display!"
                  ),
                  React.createElement("td", null)
                )
              )
            )
          )
        ),
        React.createElement("div", { className: "spacer0" }),
        React.createElement(
          "div",
          { className: "d-flex justify-content-center" },
          React.createElement(
            "div",
            { className: "controls framer row" },
            React.createElement(
              "form",
              { onSubmit: this.handleSubmit, className: "mr-auto p-2" },
              React.createElement("input", { type: "text", className: "mt-1", placeholder: "New Task", value: new_task, onChange: this.handleChange }),
              React.createElement(
                "button",
                { type: "submit", className: "btn btn-light btn-sm ml-2" },
                "Submit"
              )
            ),
            React.createElement(
              "div",
              { className: "d-flex align-items-center" },
              React.createElement(
                "button",
                { className: "btn-light btn-sm", id: active === 'all' ? 'active' : '', name: "all", onClick: this.toggleFilter },
                "all"
              ),
              React.createElement(
                "button",
                { className: "btn-light btn-sm", id: active === 'active' ? 'active' : '', name: "active", onClick: this.toggleFilter },
                "active"
              ),
              React.createElement(
                "button",
                { className: "btn-light btn-sm", id: active === 'completed' ? 'active' : '', name: "completed", onClick: this.toggleFilter },
                "done"
              )
            )
          )
        )
      );
    }
  }]);

  return ToDoList;
}(React.Component);

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById('root'));