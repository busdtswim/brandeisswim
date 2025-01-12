// src/app/page.js
import Image from 'next/image';
import Footer from '../components/Footer';
import { PrismaClient } from '@prisma/client';
import '../style/content.css';

async function getPageContent() {
  const prisma = new PrismaClient();
  const content = await prisma.site_content.findMany({
    orderBy: {
      order_num: 'asc'
    }
  });
  return content;
}

export default async function Home() {
  const content = await getPageContent();
  
  const sections = content.reduce((acc, item) => {
    acc[item.section] = {
      title: item.title,
      content: item.content
    };
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-blue-100">
      <div className="container mx-auto mt-8 px-4">
        <section className="mb-12">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image 
              src="/header.jpeg" 
              alt="Swimming pool" 
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold text-center">BRANDEIS swimming lessons</h1>
            </div>
          </div>
        </section>

        {content.map((section) => (
          <section key={section.section} className="text-black">
            <h2 className="text-3xl font-bold mb-4 text-black">{section.title}</h2>
            <div 
              dangerouslySetInnerHTML={{ __html: section.content }}
              className="prose custom-prose max-w-none text-black" 
            />
          </section>
        ))}
      </div>

      <Footer />
    </main>
  );
}