const ShowCaseItem = props => {
  const {card} = props
  const {name, imageUrl} = card
  console.log(props)

  return (
    <>
      <img className="list-img" src={imageUrl} alt={name} />
      <h1 className="list-heading">{name}</h1>
    </>
  )
}

export default ShowCaseItem
