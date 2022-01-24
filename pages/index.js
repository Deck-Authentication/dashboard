export default function Home({ BACKEND_URL }) {
  return (
    <h1 className="container mx-auto text-3xl font-bold">
      Hi Peter Nguyen
      <button className="btn btn-primary rounded-full">daisyUI Button</button>
    </h1>
  )
}

export async function getStaticProps(context) {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: { BACKEND_URL },
  }
}
