import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    items: [],
    newItem: {
      name: '',
      description: '',
      price: '',
      quantity: '' 
    },
    editItem: {
      id: null,
      name: '',
      description: '',
      price: '',
      quantity: ''
    }
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    axios
      .get('http://localhost:3001/api/items')
      .then((response) => {
        this.setState({
          items: response.data
        });
      })
      .catch((error) => {
        console.error(`Error fetching items: ${error}`);
      });
  };

  handleChange = (e) => {
    this.setState({
      newItem: {
        ...this.state.newItem,
        [e.target.name]: e.target.value
      },
      editItem: {
        ...this.state.editItem,
        [e.target.name]: e.target.value
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, price, quantity } = this.state.newItem;
    if (name && description && price) {
      axios
        .post('http://localhost:3001/api/items', this.state.newItem)
        .then((response) => {
          this.fetchItems(); 
          this.setState({ newItem: { name: '', description: '', price: '', quantity: '' } }); 
        })
        .catch((error) => {
          console.error(`Error creating item: ${error}`);
        });
    }
  };

  handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/api/items/${id}`)
      .then((response) => {
        this.fetchItems(); 
      })
      .catch((error) => {
        console.error(`Error deleting item: ${error}`);
      });
  };

  handleEdit = (item) => {
    this.setState({
      editItem: {
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity || ''
      }
    });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    const { name, description, price, quantity } = this.state.editItem;

    if (name && description && price) {
      axios
        .put(`http://localhost:3001/api/items/${this.state.editItem.id}`, {
          name,
          description,
          price,
          quantity
        })
        .then((response) => {
          this.fetchItems(); 
          this.setState({
            editItem: {
              id: null,
              name: '',
              description: '',
              price: '',
              quantity: ''
            }
          }); 
        })
        .catch((error) => {
          console.error(`Error updating item: ${error}`);
        });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">Item Manager</header>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            value={this.state.newItem.name}
            onChange={this.handleChange}
            placeholder="Item Name"
            required
          />
          <input
            type="text"
            name="description"
            value={this.state.newItem.description}
            onChange={this.handleChange}
            placeholder="Item Description"
            required
          />
          <input
            type="number"
            name="price"
            value={this.state.newItem.price}
            onChange={this.handleChange}
            placeholder="Item Price"
            required
          />
          <input
            type="number"
            name="quantity"
            value={this.state.newItem.quantity}
            onChange={this.handleChange}
            placeholder="Item Quantity"
          />
          <button type="submit">Add Item</button>
        </form>

        {this.state.editItem.id && (
          <form onSubmit={this.handleUpdate}>
            <h2>Edit Item</h2>
            <input
              type="text"
              name="name"
              value={this.state.editItem.name}
              onChange={this.handleChange}
              placeholder="Item Name"
              required
            />
            <input
              type="text"
              name="description"
              value={this.state.editItem.description}
              onChange={this.handleChange}
              placeholder="Item Description"
              required
            />
            <input
              type="number"
              name="price"
              value={this.state.editItem.price}
              onChange={this.handleChange}
              placeholder="Item Price"
              required
            />
            <input
              type="number"
              name="quantity"
              value={this.state.editItem.quantity}
              onChange={this.handleChange}
              placeholder="Item Quantity"
            />
            <button type="submit">Update Item</button>
          </form>
        )}

        <div>
          <h2>Items List</h2>
          {this.state.items.map((item) => (
            <div key={item._id} className="item">
              <p>Name: {item.name}</p>
              <p>Description: {item.description}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => this.handleEdit(item)}>Edit</button>
              <button onClick={() => this.handleDelete(item._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;