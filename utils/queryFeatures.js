class QueryFeatures {

    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }


    filter() {
        const queryObj = {...this.queryString}

        { vues: {$gt: 100}}


        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
        excludedFields.forEach(field => delete queryObj[field])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    search() {
        if (this.queryString.search) {

            const searchRegex = new RegExp(this.queryString.search, 'i')

            this.query = this.query.find({
                $or : [
                    {titre: searchRegex },
                    {contenu: searchRegex },
                    {auteur: searchRegex}
                ]
            })

        }

        return this
    }

    sort() {
        if (this.queryString.sort) {
            // "vues,createdAt" "vues createdAt" 
            const sortBy= this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }

        return this
    }
    


    paginate() {
        const page = Math.max(1, (parseInt(this.queryString.page, 10) || 1));
        const limit = Math.min(
            100,
            Math.max(1, parseInt(this.queryString.limit, 10) || 10)
        )

        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)

        this.paginationInfo = {
            page,
            limit,
            skip
        }

        return this 
    }

    getPaginationInfo(totalCount) {
        if (!this.paginationInfo) {
            return null
        }
        
        const {page, limit} = this.paginationInfo;
        const totalPages = Math.ceil(totalCount / limit)

        return {
            currentPage: page,
            totalPages: totalPages,
            pageSize: limit,
            totalItems : totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }

}

module.exports = QueryFeatures