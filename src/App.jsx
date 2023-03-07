/*
? DESAFIO - Shopping Cart:

Você deve desenvolver um carrinho de compras funcional.
Funcionalidades que esperamos que você desenvolva:

todo - inserção de novos produtos no carrinho
todo - remoção de produtos já inseridos
todo - alteração de quantidade de cada item 
todo - cálculo do preço total dos itens inseridos

todo - FUNCIONALIDADE EXTRA: aplicação de cupom de desconto
*/
import './styles.scss';

import PageHeader from './layout/PageHeader';
import PageTitle from './layout/PageTitle';
import Summary from './Summary';
import TableRow from './TableRow';
import { useEffect, useState } from 'react';
import { api } from './provider';
import axios from "axios";

function App() {

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const productObjetct = {
    name: 'produto',
    category: 'categoria',
    price: randomNumber(90, 300),
    quantity: 1
  };

  const [cart, setCart] = useState([]);

  const fetchData = () => {
    api.get('/cart').then((response) => setCart(response.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    api.post('/cart', productObjetct).then(response => console.log(response));
    fetchData();
  };

  const handleRemoveItem = (id) => {
    api.delete(`/cart/${id}`);
    fetchData();
  };

  const handleUpdateItem = (item, action) => {
    var newQuatity = item.quantity;

    if (action === 'decrease') {
      if (newQuatity === 1) {
        return;
      }
      newQuatity -= 1;
    }
    if (action === 'increase') {
      newQuatity += 1;
    }
    
    const newData = { ...item, quantity: newQuatity };
    delete newData._id;
    
    api.put(`/cart/${item._id}`, newData).then((response) => {
      console.log(response);
      fetchData();
    });
  };

  const getTotal = () => {
    var sum = 0;

    for (let item of cart) {
      console.log(cart);
      sum += item.price * item.quantity;
    }

    return sum;
  };

  const cartTotal = getTotal();

  return (
    <>
      <PageHeader />
      <main>
        <PageTitle data={'Seu carrinho'} />
        <div className='content'>
          <section>
            <button onClick={handleAddItem} style={{ padding: '5px 10px', marginBottom: 15 }}>Add to cart</button>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>-</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <TableRow key={item._id} data={item} handleRemoveItem={handleRemoveItem} handleUpdateItem={handleUpdateItem} />
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan='5' style={{ textAlign: 'center' }}>
                      <b>Carrinho de compras vazio.</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          <aside>
            <Summary cartTotal={cartTotal} />
          </aside>
        </div>
      </main>
    </>
  );
}

export default App;
