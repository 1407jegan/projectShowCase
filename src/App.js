/* eslint-disable consistent-return */
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ShowCaseItem from './components/ShowCaseItem'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const constanceStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ShowCaseHeader = props => {
  const {activeId, updateActiveId} = props

  const onChangeCategory = event => {
    updateActiveId(event.target.value)
  }

  return (
    <select className="select" value={activeId} onChange={onChangeCategory}>
      {categoriesList.map(each => (
        <option value={each.id} key={each.id}>
          {each.displayText}
        </option>
      ))}
    </select>
  )
}

// Replace your code here
class App extends Component {
  state = {
    activeId: categoriesList[0].id,
    statusValue: constanceStatus.initial,
    projectsShowcaseList: [],
  }

  componentDidMount() {
    this.getProjectsShowcase()
  }

  getProjectsShowcase = async () => {
    const {activeId} = this.state
    // console.log(activeId)
    this.setState({statusValue: constanceStatus.inProgress})

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsShowcaseList: updatedData,
        statusValue: constanceStatus.success,
      })
    }
    if (response.status === 401) {
      this.setState({statusValue: constanceStatus.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  onClickRetryBtn = () => {
    this.getProjectsShowcase()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/project-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-des">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsShowcaseList} = this.state
    // console.log(projectsShowcaseList)
    return (
      <div className="project-container">
        {projectsShowcaseList.map(each => (
          <ShowCaseItem key={each.id} card={each} />
        ))}
      </div>
    )
  }

  renderProjectShowCaseView = () => {
    const {statusValue} = this.state
    // console.log(statusValue)

    switch (statusValue) {
      case constanceStatus.success:
        this.renderSuccessView()
        break
      case constanceStatus.failure:
        this.renderFailureView()
        break
      case constanceStatus.inProgress:
        this.renderLoadingView()
        break
      default:
        return null
    }
  }

  updateActiveId = activeId => {
    this.setState({activeId}, this.getProjectsShowcase)
  }

  render() {
    const {activeId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <ShowCaseHeader
          activeId={activeId}
          updateActiveId={this.updateActiveId}
        />
        {this.renderProjectShowCaseView()}
      </div>
    )
  }
}

export default App
