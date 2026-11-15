import { ProjectsDirectoryClient } from "@/components/sections/ProjectsDirectoryClient";
import { getPortfolioData } from "@/lib/portfolioDb";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const data = await getPortfolioData();
  return (
    <ProjectsDirectoryClient projects={data.projects} profile={data.profile} />
  );
}
