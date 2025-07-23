import Image from "next/image";
import Listing from "./components/listing";

export default async function Home() {
  const categoriesRequest = await fetch(
    "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory",
    {
      cache: "force-cache",
      next: {
        revalidate: 86400,
        tags: ["categories"],
      }
    }
  );
  const categories = await categoriesRequest.json();
  return (
    <div>
      <Listing categories={categories} />
    </div>
  );
}
