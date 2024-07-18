import { getServerSession } from "next-auth"

export default async function Metricas(){

    const session = await getServerSession()

    return(

        <main>
            Ola, {session?.user?.email}
        </main>

    )

}