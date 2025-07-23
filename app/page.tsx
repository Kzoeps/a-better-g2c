import Image from "next/image";
import Listing from "./components/listing";

export default async function Home() {
  const categoriesRequest = await fetch(
    "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory"
  );
  const categories = await categoriesRequest.json();
  return (
    <div>
      <Listing categories={categories} />
    </div>
  );
}
