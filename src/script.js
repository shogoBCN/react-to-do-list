// API user: 349

const checkStatus =  (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error('Request failed. Either 404 or 500.');
}

const json = (response) => response.json();

class Task extends React.Component {
  render() {
    const { task, onDelete, onComplete } = this.props;
    const { id, content, completed } = task;
    return (
      <tr className={completed.toString()}>
        <td><input type="checkbox" onChange={() => onComplete(id, completed)} checked={completed} /></td>
        <td className="task-content">{content}</td>
        <td><button className="btn btn-light btn-sm delete" onClick={() => onDelete(id)}>Delete</button></td>
      </tr>
    )
  }
}

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_task: '',
      tasks: [],
      filter: 'all',
      active: 'all',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  toggleFilter(e) {
    this.setState({
      active: e.target.name,
      filter: e.target.name
    })
    console.log(this.state)
    console.log(this.state.active)
  }

  toggleComplete(id, completed) {
    if (!id) {
      return;
    }
    const newState = completed ? 'active' : 'complete';
    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_${newState}?api_key=349`, {
      method: "PUT",
      mode: "cors",
    }).then(checkStatus)
      .then(json)
      .then((data) => {
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  deleteTask(id) {
    if (!id) {
      return;
    }
    fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=349`, {
      method: "DELETE",
      mode: "cors",
    }).then(checkStatus)
      .then(json)
      .then((data) => {
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message })
      })
  }

  fetchTasks() {
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=349")
    .then(checkStatus)
    .then(json)
    .then((response) => {
      console.log(response);
      this.setState({tasks: response.tasks})
    })
    .catch(error => {
      console.error(error.message);
    })
  }

  handleChange(event) {
    this.setState({ new_task: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { new_task } = this.state;
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
      }),
    }).then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({new_task: ''});
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.essage });
        console.log(error);
      })
  }

  render() {
    const { new_task, tasks, filter, active, buttons } = this.state;
    console.log("look here:", this.state)
    return (
      <div>
        <div className="spacer0"></div>
        <div className="d-flex justify-content-center">
          <div className="framer">
            <table className="table table-responsive">
              <thead>
                <tr className="table-secondary">
                  <th width="52px" className="title-task" scope="col"></th>
                  <th width="400px" className="title-check" scope="col">To-do List</th>
                  <th width="82px" className="title-button" scope="col"></th>
                </tr>
                </thead>
              <tbody>
                {tasks.length > 0 ? tasks.filter(task => {
                  if (filter === 'all') {
                    return true;
                  } else if ( filter === 'active') {
                    return !task.completed;
                  } else {
                    return task.completed;
                  }  
                }).map((task) => {
                  return <Task key={task.id} task={task} onDelete={this.deleteTask} onComplete={this.toggleComplete} />
                }) : <tr>
                       <td></td>
                       <td>No content to display!</td>
                       <td></td>
                     </tr> 
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="spacer0"></div>
        <div className="d-flex justify-content-center">
          <div className="controls framer row">
            <form onSubmit={this.handleSubmit} className="mr-auto p-2">
              <input type="text" className="mt-1" placeholder="New Task" value={new_task} onChange={this.handleChange} />
              <button type="submit" className="btn btn-light btn-sm ml-2">Submit</button>
            </form>

            <div className="d-flex align-items-center">
              <button className="btn-light btn-sm" id={active === 'all' ? 'active' : ''} name="all" onClick={this.toggleFilter}>all</button> 
              <button className="btn-light btn-sm" id={active === 'active' ? 'active' : ''} name="active" onClick={this.toggleFilter}>active</button>
              <button className="btn-light btn-sm" id={active === 'completed' ? 'active' : ''} name="completed" onClick={this.toggleFilter}>done</button>
            </div>

          </div>
        </div>
      </div>
    )  
  }
}

ReactDOM.render(
  <ToDoList />,
  document.getElementById('root')
);