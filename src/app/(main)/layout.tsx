import Navbar from "@/components/main/navbar/Navbar";
import "../globals.css";
import ClientOnly from "@/components/ClientOnly";
import ToasterProvider from "../providers/ToasterProvider";
import RegisterModal from "@/components/modals/RegisterModal";
import getCurrentUser from "@/actionserver/getCurrentUser";
import RentModal from "@/components/modals/RentModal";


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const currentUser= await getCurrentUser()
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <RentModal/>
        <RegisterModal/>
        <Navbar currentUser={currentUser}/>
      </ClientOnly>
      {children}
    </>
  );
}
