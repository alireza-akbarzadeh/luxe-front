'use client';

import { IconLoader2, IconUpload } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import { BlogAiPanel } from '@/domains/blog-admin/components/blog-ai-panel';
import {
  mapBlogPostToFormValues,
  mapFormToBlogPostRequest
} from '@/domains/blog-admin/lib/blog-post-mapper';
import { uploadBlogImage } from '@/domains/blog-admin/lib/upload-blog-image';
import {
  BLOG_CATEGORY_NONE,
  BLOG_SECTION_TYPE_OPTIONS,
  BLOG_STATUS_OPTIONS,
  blogPostDefaultValues,
  blogPostFormSchema
} from '@/domains/blog-admin/schemas/blog-post-schema';
import { BlogMarkdownEditor } from '@/domains/blog-admin/sections/blog-markdown-editor';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { IMAGE_FALLBACK } from '@/lib/images';
import { slugify } from '@/lib/utils';
import {
  getGetAdminBlogPostsIdQueryKey,
  useGetAdminBlogPostsId
} from '@/services/-admin-blog-posts-{id}-get';
import { usePutAdminBlogPostsId } from '@/services/-admin-blog-posts-{id}-put';
import { getGetAdminBlogPostsQueryKey } from '@/services/-admin-blog-posts-get';
import { usePostAdminBlogPosts } from '@/services/-admin-blog-posts-post';
import { useGetBlogCategories } from '@/services/-blog-categories-get';

interface BlogPostFormProps {
  postId?: string;
  isEdit?: boolean;
}

export function BlogPostForm({ isEdit = false, postId }: BlogPostFormProps) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [contentEditorKey, setContentEditorKey] = useState(0);

  const { data: categoriesData } = useGetBlogCategories();

  const { data: { data: post } = {}, isLoading: isLoadingPost } = useGetAdminBlogPostsId(
    Number(postId),
    {
      query: { enabled: isEdit && Boolean(postId) }
    }
  );

  const { mutateAsync: createPost, isPending: isCreating } = usePostAdminBlogPosts({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminBlogPostsQueryKey() });
      }
    }
  });

  const { mutateAsync: updatePost, isPending: isUpdating } = usePutAdminBlogPostsId({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminBlogPostsQueryKey() });
        if (post?.id) {
          void queryClient.invalidateQueries({
            queryKey: getGetAdminBlogPostsIdQueryKey(post.id)
          });
        }
      }
    }
  });

  const isPending = isCreating || isUpdating || isUploadingHero;

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data?.categories ?? [];
    return [
      { label: 'No category', value: BLOG_CATEGORY_NONE },
      ...categories
        .filter((cat) => Boolean(cat.id))
        .map((cat) => ({
          label: cat.name ?? `Category ${cat.id}`,
          value: String(cat.id)
        }))
    ];
  }, [categoriesData]);

  const form = useAppForm({
    defaultValues: blogPostDefaultValues,
    validators: {
      onChange: blogPostFormSchema,
      onSubmit: blogPostFormSchema
    },
    listeners: {
      onChange: ({ formApi }) => {
        const title = formApi.getFieldValue('title');
        const slugMeta = formApi.getFieldMeta('slug');
        if (!slugMeta?.isDirty && title) {
          formApi.setFieldValue('slug', slugify(title));
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = mapFormToBlogPostRequest(value);
        if (isEdit && post?.id) {
          await updatePost({ id: post.id, data: payload });
          toast.success('Post updated successfully');
        } else {
          const created = await createPost({ data: payload });
          toast.success('Post created successfully');
          const newId = created.data?.id;
          if (newId) {
            push(`/dashboard/blog/edit/${newId}`);
            return;
          }
        }
        push('/dashboard/blog');
      } catch (error) {
        toast.error(isEdit ? 'Failed to update post' : 'Failed to create post', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (isEdit && post) {
      form.reset(mapBlogPostToFormValues(post));
    }
  }, [isEdit, post, form]);

  const handleHeroUpload = async (file: File) => {
    setIsUploadingHero(true);
    try {
      const publicUrl = await uploadBlogImage(file);
      form.setFieldValue('hero_image_url', publicUrl);
      toast.success('Hero image uploaded');
    } catch (error) {
      toast.error('Failed to upload hero image', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsUploadingHero(false);
    }
  };

  if (isEdit && isLoadingPost) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-40 w-full' />
        </CardContent>
      </Card>
    );
  }

  const editPostId = isEdit && post?.id ? post.id : undefined;

  return (
    <>
      {editPostId ? (
        <EntityWorkflowPanel
          workflowKey='blog_post'
          entityId={editPostId}
          className='mb-6'
          onTransitionSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: getGetAdminBlogPostsIdQueryKey(editPostId)
            });
            void queryClient.invalidateQueries({ queryKey: getGetAdminBlogPostsQueryKey() });
          }}
        />
      ) : null}

      <Card className='border-border/40 bg-card/40 backdrop-blur-2xl'>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit article' : 'Create article'}</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update content, SEO, and placement. Use the workflow panel to publish.'
              : 'Draft a new blog article. Save as draft, then publish via workflow.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <Flex direction='column' spacing={6}>
                <form.Subscribe
                  selector={(state) => ({
                    title: state.values.title,
                    excerpt: state.values.excerpt ?? '',
                    sectionType: state.values.section_type
                  })}
                  children={({ title, excerpt, sectionType }) => (
                    <BlogAiPanel
                      title={title}
                      excerpt={excerpt}
                      sectionType={sectionType}
                      disabled={isPending}
                      onBlocksGenerated={(blocks) => {
                        form.setFieldValue('content_blocks', blocks);
                        setContentEditorKey((key) => key + 1);
                      }}
                      onExcerptGenerated={(text) => form.setFieldValue('excerpt', text)}
                      onSeoGenerated={(metaTitle, metaDescription) => {
                        if (metaTitle) form.setFieldValue('meta_title', metaTitle);
                        if (metaDescription)
                          form.setFieldValue('meta_description', metaDescription);
                      }}
                    />
                  )}
                />

                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='title'
                      children={(field) => (
                        <field.TextField label='Title' placeholder='Article title' required />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='slug'
                      children={(field) => (
                        <field.TextField label='Slug' placeholder='my-article' required />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='section_type'
                      children={(field) => (
                        <field.Select
                          label='Section type'
                          options={[...BLOG_SECTION_TYPE_OPTIONS]}
                          required
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='status'
                      children={(field) => (
                        <field.Select
                          label='Status'
                          options={[...BLOG_STATUS_OPTIONS]}
                          description={
                            isEdit
                              ? 'Prefer the workflow panel for lifecycle changes'
                              : 'New posts usually start as draft'
                          }
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='category_id'
                      children={(field) => (
                        <field.Select label='Category' options={categoryOptions} />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='excerpt'
                      children={(field) => (
                        <field.TextArea label='Excerpt' rows={3} placeholder='Short summary…' />
                      )}
                    />
                  </GridItem>
                </Grid>

                <Separator />

                <Flex direction='column' spacing={3}>
                  <Text className='text-sm font-medium'>Hero image</Text>
                  <form.Subscribe
                    selector={(state) => state.values.hero_image_url}
                    children={(heroUrl) => (
                      <Flex direction='row' align='center' spacing={4}>
                        <div className='relative h-24 w-40 overflow-hidden rounded-md border'>
                          <AppImage
                            src={heroUrl || IMAGE_FALLBACK}
                            alt='Hero preview'
                            fill
                            className='object-cover'
                            sizes='160px'
                          />
                        </div>
                        <Flex direction='column' spacing={2}>
                          <form.AppField
                            name='hero_image_url'
                            children={(field) => (
                              <field.TextField label='Image URL' placeholder='https://…' />
                            )}
                          />
                          <form.AppField
                            name='hero_image_alt'
                            children={(field) => (
                              <field.TextField label='Alt text' placeholder='Describe the image' />
                            )}
                          />
                          <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handleHeroUpload(file);
                              e.target.value = '';
                            }}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            disabled={isUploadingHero}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {isUploadingHero ? (
                              <IconLoader2 className='size-4 animate-spin' />
                            ) : (
                              <IconUpload className='size-4' />
                            )}
                            Upload
                          </Button>
                        </Flex>
                      </Flex>
                    )}
                  />
                </Flex>

                <Separator />

                <Flex direction='column' spacing={3}>
                  <Text className='text-sm font-medium'>Article content</Text>
                  <form.AppField
                    name='content_blocks'
                    children={(field) => (
                      <BlogMarkdownEditor
                        key={`${post?.id ?? 'new'}-${contentEditorKey}`}
                        value={field.state.value}
                        onChange={(blocks) => field.handleChange(blocks)}
                      />
                    )}
                  />
                </Flex>

                <Separator />

                <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                  <GridItem>
                    <form.AppField
                      name='meta_title'
                      children={(field) => (
                        <field.TextField label='Meta title' placeholder='SEO title' />
                      )}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='reading_time_minutes'
                      children={(field) => (
                        <field.NumberField label='Reading time (min)' min={1} max={120} />
                      )}
                    />
                  </GridItem>
                  <GridItem className='sm:col-span-2'>
                    <form.AppField
                      name='meta_description'
                      children={(field) => <field.TextArea label='Meta description' rows={2} />}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='is_featured'
                      children={(field) => <field.Switch label='Featured' />}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='is_editor_pick'
                      children={(field) => <field.Switch label='Editor pick' />}
                    />
                  </GridItem>
                  <GridItem>
                    <form.AppField
                      name='is_trending'
                      children={(field) => <field.Switch label='Trending' />}
                    />
                  </GridItem>
                </Grid>

                <Flex direction='row' justify='end' spacing={2}>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => push('/dashboard/blog')}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <form.Submit
                    label={isEdit ? 'Save changes' : 'Create draft'}
                    isPending={isPending}
                    className='w-auto flex-none px-6'
                  />
                </Flex>
              </Flex>
            </form.Root>
          </form.AppForm>
        </CardContent>
      </Card>
    </>
  );
}
