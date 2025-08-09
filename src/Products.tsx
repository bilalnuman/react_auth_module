import { useEffect, useState } from 'react';
import { useApi } from './features/auth/services/authService';
import { DataTable, type Column } from './features/datatable';
import styles from './features/datatable/DataTable.module.css';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import type { Direction } from './hooks/useDataTable';
import useSearchQuery from './util/querySearch';
import Pagination from './features/datatable/Pagination';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

const Products = () => {
    const { page, gotoPage } = useSearchQuery();
    const { request, loading, data, error } = useApi<undefined, Post[]>();
    const [selectedPosts, setSelectedPosts] = useState<Set<string | number>>(new Set());
    const [showCheckboxes, setShowCheckboxes] = useState(true);

    useEffect(() => {
        request({
            endpoint: 'posts',
            method: 'GET',
            keepPreviousData: true,
            showToastError: false,
        });
    }, [request]);

    // Action handlers
    const handleViewPost = (post: Post) => {
        alert(`Viewing post: ${post.title}`);
        // In a real app, you might navigate to a detail page or open a modal
        console.log('View post:', post);
    };

    const handleEditPost = (post: Post) => {
        console.log(post)
        alert(`Editing post: ${post.title}`);
        // In a real app, you might navigate to an edit form or open a modal
        console.log('Edit post:', post);
    };

    const handleDeletePost = (post: Post) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
        if (confirmed) {
            alert(`Deleted post: ${post.title}`);
            // In a real app, you would make an API call to delete the post
            console.log('Delete post:', post);
        }
    };

    const getSortIcon = (direction: Direction) => {
        if (direction === 'asc') return <FaSortUp />;
        if (direction === 'desc') return <FaSortDown />;
        return <FaSort />;
    };


    // Define table columns
    const columns: Column<Post>[] = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            getSortIcon: (direction: Direction) => getSortIcon(direction)
        },
        {
            key: 'userId',
            label: 'User ID',
            sortable: true,
            getSortIcon: (direction: Direction) => getSortIcon(direction)
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            getSortIcon: (direction: Direction) => getSortIcon(direction),
            render: (value: string) => (
                <div style={{ maxWidth: '300px' }}>
                    <strong>{value}</strong>
                </div>
            ),
        },
        {
            key: 'body',
            label: 'Content',
            sortable: true,
            getSortIcon: (direction: Direction) => getSortIcon(direction),
            render: (value: string) => (
                <div style={{
                    maxWidth: '400px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {value}
                </div>
            ),
        },
        {
            key: 'id',
            label: 'Actions',
            sortable: false,
            render: (value: number, post: Post) => (
                <div className={styles.actionsContainer}>
                    <button
                        onClick={() => handleViewPost(post)}
                        className={`${styles.actionButton} ${styles.primary}`}
                        title="View Post"
                    >
                        👁️
                    </button>
                    <button
                        onClick={() => handleEditPost(post)}
                        className={`${styles.actionButton} ${styles.success}`}
                        title="Edit Post"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDeletePost(post)}
                        className={`${styles.actionButton} ${styles.danger}`}
                        title="Delete Post"
                    >
                        🗑️
                    </button>
                </div>
            ),
        },
    ];

    const handleSelectionChange = (selected: Set<string | number>) => {
        setSelectedPosts(selected);
    };

    const handleBulkAction = (action: string) => {
        if (selectedPosts.size === 0) {
            alert('Please select some posts first');
            return;
        }

        const selectedIds = Array.from(selectedPosts);
        alert(`${action} action for posts: ${selectedIds.join(', ')}`);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Posts Data Table
                </h1>

                {/* Controls */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={showCheckboxes}
                            onChange={(e) => setShowCheckboxes(e.target.checked)}
                        />
                        Enable Selection
                    </label>

                    {showCheckboxes && selectedPosts.size > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleBulkAction('Delete')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete Selected
                            </button>
                            <button
                                onClick={() => handleBulkAction('Archive')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Archive Selected
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    Error: {error}
                </div>
            )}

            <DataTable
                data={data || []}
                columns={columns}
                loading={loading}
                options={{
                    defaultSortKey: 'id',
                    defaultSortDirection: 'asc',
                    enableSelection: showCheckboxes,
                }}
                paginationComponent={
                    <div className='my-5 w-full flex justify-center items-center'>
                        <Pagination
                            currentPage={page}
                            totalPages={100}
                            goToPage={gotoPage}
                        />
                    </div>
                }
                onSelectionChange={handleSelectionChange}
            />
        </div>
    );
};

export default Products;
