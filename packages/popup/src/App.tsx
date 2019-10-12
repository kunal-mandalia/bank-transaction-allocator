import React from 'react';
import { store } from '@bank-transaction-allocator/common'
import { startProcessingTransactions, setupMessageListeners } from './popup'
import { History } from './History'
import { Upcoming } from './Upcoming'
import { Spacer } from './Spacer'
import { Button } from './Button'

import './App.css';

interface IProps {}
interface IState {
  storeState: store.State | null
}

class WithStore extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      storeState: null
    }
  }

  componentDidMount() {
    setupMessageListeners({
      onStoreChange: this.handleStoreChange
    })
    this.syncStoreState()
  }

  handleStoreChange = async () => {
    const state = await store.get()
    this.setState({ storeState: state })
    this.forceUpdate()
  }

  syncStoreState = async () => {
    const state = await store.get()
    this.setState({ storeState: state })
  }

  render() {
    if (!this.state.storeState) {
      return (<div>Waiting for store...</div>)
    }

    return (<App storeState={this.state.storeState} syncStoreState={this.syncStoreState} />)
  }
}

interface IAppProps {
  storeState: store.State,
  syncStoreState: Function
}

class App extends React.Component<IAppProps> {
  start = async () => {
    await store.set({ status: store.Status.ACTIVE })
    await this.props.syncStoreState()
    await startProcessingTransactions()
  }

  stop = async () => {
    await store.set({ status: store.Status.IDLE })
    await this.props.syncStoreState()
  }

  getUpcomingAllocations = () => {
    const { storeState } = this.props
    const historicalTransactionId = this.props.storeState.history.map(h => h.id)
    return storeState.allocations.filter(a => {
      if (!a.isAllocatable) return false
      if (historicalTransactionId.includes(a.transaction.id)) return false
      return true
    })
  }

  render() {
    const upcoming = this.getUpcomingAllocations()
    const status = this.props.storeState.status
    console.log('App this', this, this.props.storeState)
    console.log('upcoming', upcoming)
    return (
      <div className="App">
        {
          status === store.Status.ACTIVE
          ? <Button label="Stop" btnStyle="warning" onClick={this.stop}/>
          : <Button label="Start" btnStyle="success" onClick={this.start}/>
        }
        <Spacer />
        <h1>History</h1>
        <History history={this.props.storeState.history} />
        
        <Spacer />
        <h1>Upcoming</h1>
        <Upcoming allocations={upcoming} />
      </div>
    );
  }
}

export default WithStore;
