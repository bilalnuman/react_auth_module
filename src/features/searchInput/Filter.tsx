
import { useNavigate } from 'react-router-dom';
import SearchInput, { type SearchInputRef } from '.'
import { useRef } from 'react';
import useSearchQuery from '../../util/querySearch';

const SearchInputDebounce = () => {
    const navigate = useNavigate()
    const searchRef = useRef<SearchInputRef>(null);
    const { setFilter, groupedQueries, params, page, gotoPage, clearFilters, setFilters } = useSearchQuery();

    console.log(params)


    const applyFilters = () => {
        setFilters(
            {
                brands: ['apple', 'samsung'],
                colors: ['red'],
                gender: 'male',
            },
            {
                isMultiple: true,
                resetFilters: false,
                resetPage: true,
                clearKeys: ['search'],
            }
        );
    };



    return (
        <div className='flex justify-around mt-10'>
            <div>
                <div className='flex-1'>
                    <SearchInput
                        ref={searchRef}
                        onClick={(value) => setFilter('search', value, { resetFilters: true })}
                        className='w-[300px]'
                        isIconInside={false}
                        iconPosition='right'

                    />
                </div>
                <div className='mt-4'>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <button className='border p-2 me-5' onClick={() => setFilter('brands', 'watch')}>Brand: Watch</button>
                            <button className='border p-2' onClick={() => setFilter('brands', 'cars')}>Brand: Cars</button>
                        </div>

                        <label>
                            <input
                                type="checkbox"
                                checked={params.getAll('colors').includes('red')}
                                onChange={() => setFilter('colors', 'red')}
                            />
                            Red
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={params.getAll('colors').includes('green')}
                                onChange={() => setFilter('colors', 'green')}
                            />
                            green
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                checked={params.get('gender') === 'male'}
                                onChange={() => setFilter('gender', 'male', { isMultiple: false })}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                checked={params.get('gender') === 'female'}
                                onChange={() => setFilter('gender', 'female', { isMultiple: false })}
                            />
                            FeMale
                        </label>
                        <div className='flex items-center gap-5'>
                            <button onClick={() => gotoPage(page - 1)}>Previous</button>
                            {page}
                            <button onClick={() => gotoPage(page + 1)}>Next</button>
                        </div>

                    </div>
                    <button className='border p-2 ms-4' onClick={() => { clearFilters(["page"]); searchRef.current?.clear(); navigate('/searchInput') }}>clear</button>
                    <button className='border p-2 ms-4' onClick={applyFilters}>Apply filters</button>

                </div>
            </div>
            <div className="mt-4">
                <h3>Grouped Queries:</h3>
                <pre>{JSON.stringify(groupedQueries, null, 2)}</pre>
            </div>
        </div>
    )
}

export default SearchInputDebounce