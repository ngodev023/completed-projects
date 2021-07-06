// Stateless component responsible for generating a url for the image tags.
// uses template literal to plug data retrieved from api call into flickr's image address template.
const Photo = props => {
    let data = props.data
    let url = `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_m.jpg`
    return (
        <li>
            <img src={url} alt={data.title} />
        </li>)
}

export default Photo;