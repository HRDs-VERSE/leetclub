"use client"
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import usePlatformAPI from '@/fetchAPI/usePlatformAPI';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from './ui/skeleton';

interface Commit {
  message: string;
  author: {
    user: {
      login: string;
    };
  };
}

interface Repository {
  name: string;
  refs: {
    nodes: Array<{
      target: {
        history: {
          edges: Array<{
            node: Commit;
          }>;
        };
      };
    }>;
  };
}

const GitHubCommits = ({ username }: { username: string }) => {
  const { getGitHubCommits } = usePlatformAPI();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const fetchRepositories = async (isInitial: boolean = false) => {
    try {
      if (!username || isLoading) return;
      setIsLoading(true);

      const result = await getGitHubCommits(username, false, !isInitial);
      
      if (result) {
        setRepositories(prev => 
          isInitial ? result.repositories : [...prev, ...result.repositories]
        );
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Error fetching commits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccordionOpen = async (value: string) => {
    if (value === "all-commits" && repositories.length === 0) {
      await fetchRepositories(true);
    }
    setIsAccordionOpen(value === "all-commits");
  };

  const processedRepositories = repositories.map(repo => ({
    repositoryName: repo.name,
    commits: repo.refs.nodes?.[0]?.target?.history?.edges.map(edge => edge.node) || [],
  }));

  return (
    <div className="border-[1px] border-neutral-900 p-2 px-4 rounded-[8px]">
      <Accordion 
        type="single" 
        collapsible
        onValueChange={handleAccordionOpen}
      >
        <AccordionItem value="all-commits" className="border-none">
          <AccordionTrigger>
            <div className="flex gap-[2rem]">
              All Commits
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-[2rem]">
            {isAccordionOpen && (
              <InfiniteScroll
                dataLength={repositories.length}
                next={() => fetchRepositories(false)}
                hasMore={hasMore}
                loader={<Skeleton className="h-6 w-full rounded-md" />}
                scrollableTarget="commits-container"
              >
                <div id="commits-container" className="max-h-[500px] overflow-y-auto">
                  {processedRepositories.map((repo, repoIndex) => (
                    <Accordion key={repoIndex} type="single" collapsible className="hover:bg-neutral-900 px-2 rounded-md">
                      <AccordionItem value={`repo-${repoIndex}`} className="border-none">
                        <AccordionTrigger>
                          <div className="flex gap-[2rem]">
                            {repo.repositoryName}
                          </div>
                        </AccordionTrigger>
                        {repo.commits.length === 0 ? (
                          <AccordionContent className="py-2">
                            <div>No commits available in this repository.</div>
                          </AccordionContent>
                        ) : (
                          <>
                            {repo.commits.some(commit => commit.author?.user?.login === username) ? (
                              repo.commits.map((commit, commitIndex) => (
                                <AccordionContent className="" key={commitIndex}>
                                  {commit.author?.user?.login === username ? (
                                    <div className="flex gap-2 border-b py-2 text-neutral-400">
                                      <span className="font-semibold">Message:</span> {commit.message}
                                    </div>
                                  ) : null}
                                </AccordionContent>
                              ))
                            ) : (
                              <AccordionContent className="py-2 text-neutral-400">
                                <div>No commits by {username}.</div>
                              </AccordionContent>
                            )}
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GitHubCommits;