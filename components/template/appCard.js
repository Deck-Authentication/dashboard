import Image from "next/image"

const AppCard = ({ imgSrc = "", imgAlt = "", name = "", key = "", handleDrawer = () => {} }) => {
  return (
    <button
      key={`${name}_${key}`}
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200"
      title={name}
      onClick={handleDrawer}
    >
      <div>
        <Image src={imgSrc} height={100} width={200} alt={imgAlt} />
      </div>
      <p className="w-full text-center">{name}</p>
    </button>
  )
}

export default AppCard
